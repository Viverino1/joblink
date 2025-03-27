import { neon } from "@neondatabase/serverless";

// Only create the connection on the server side
const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;

export async function getServerSql() {
  if (!sql) {
    throw new Error("Database connection can only be made on the server side");
  }
  return sql;
}

export async function createJobsTable() {
  const sql = await getServerSql();
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await sql`
      CREATE TABLE IF NOT EXISTS jobs (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        location_city VARCHAR(255) NOT NULL,
        location_state VARCHAR(255) NOT NULL,
        is_remote BOOLEAN DEFAULT false,
        description TEXT NOT NULL,
        requirements TEXT[] NOT NULL,
        job_type VARCHAR(50) NOT NULL,
        posted_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        salary VARCHAR(100) NOT NULL,
        applicants_total INTEGER DEFAULT 0,
        applicants_filled INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'open',
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        contact_email VARCHAR(255) NOT NULL,
        apply_link TEXT
      );
    `;
    console.log("Jobs table created successfully");
    // Add job approvals table
    await sql`
      CREATE TABLE IF NOT EXISTS job_approvals (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
        approver_id TEXT NOT NULL,
        approved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(job_id)
      );
    `;
    console.log("Job approvals table created successfully");
  } catch (error) {
    console.error("Error creating jobs table:", error);
    throw error;
  }
}

export async function createBookmarksTable() {
  const sql = await getServerSql();
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS bookmarks (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id TEXT NOT NULL,
        job_id UUID NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, job_id),
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
      );
    `;
    console.log("Bookmarks table created successfully");
  } catch (error) {
    console.error("Error creating bookmarks table:", error);
    throw error;
  }
}

export async function toggleBookmark(userId: string, jobId: string) {
  const sql = await getServerSql();
  try {
    // Check if bookmark exists
    const existing = await sql`
      SELECT id FROM bookmarks WHERE user_id = ${userId} AND job_id = ${jobId}
    `;

    if (existing.length > 0) {
      // Remove bookmark
      await sql`DELETE FROM bookmarks WHERE user_id = ${userId} AND job_id = ${jobId}`;
      return false; // Return false to indicate bookmark was removed
    } else {
      // Add bookmark
      await sql`
        INSERT INTO bookmarks (user_id, job_id)
        VALUES (${userId}, ${jobId})
      `;
      return true; // Return true to indicate bookmark was added
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    throw error;
  }
}

export async function getUserBookmarks(userId: string) {
  const sql = await getServerSql();
  try {
    const bookmarkedJobs = await sql`
      SELECT j.*, b.created_at as bookmarked_at
      FROM jobs j
      INNER JOIN bookmarks b ON j.id = b.job_id
      WHERE b.user_id = ${userId}
      ORDER BY b.created_at DESC;
    `;
    return bookmarkedJobs;
  } catch (error) {
    console.error("Error fetching user bookmarks:", error);
    throw error;
  }
}

export async function createJob(job: {
  title: string;
  company: string;
  location: { city: string; state: string };
  isRemote: boolean;
  description: string;
  requirements: string[];
  jobType: string;
  salary: string;
  applicants?: { total: number; filled: number };
  status?: string;
  contactEmail: string; // Add this line
  applyLink?: string;
}) {
  const sql = await getServerSql();
  try {
    const result = await sql`
      INSERT INTO jobs (
        title, company, location_city, location_state, is_remote, 
        description, requirements, job_type, salary, applicants_total,
        applicants_filled, status, contact_email, apply_link
      ) VALUES (
        ${job.title}, ${job.company}, ${job.location.city}, ${
      job.location.state
    },
        ${job.isRemote}, ${job.description}, ${job.requirements}, ${
      job.jobType
    },
        ${job.salary}, ${job.applicants?.total || 0}, ${
      job.applicants?.filled || 0
    },
        ${job.status || "open"}, ${job.contactEmail}, ${job.applyLink || null}
      ) RETURNING *;
    `;
    return result[0];
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
}

export async function getJob(id: string) {
  const sql = await getServerSql();
  try {
    const [job] = await sql`
      SELECT * FROM jobs WHERE id = ${id};
    `;
    return job
      ? {
          id: job.id,
          title: job.title,
          company: job.company,
          location: {
            city: job.location_city,
            state: job.location_state,
          },
          isRemote: job.is_remote,
          description: job.description,
          requirements: job.requirements,
          jobType: job.job_type,
          postedDate: job.posted_date,
          salary: job.salary,
          applicants: {
            total: job.applicants_total,
            filled: job.applicants_filled,
          },
          status: job.status,
          updatedAt: job.updated_at,
          contactEmail: job.contact_email,
          applyLink: job.apply_link,
        }
      : null;
  } catch (error) {
    console.error("Error fetching job:", error);
    throw error;
  }
}

export async function getJobs() {
  const sql = await getServerSql();
  try {
    const jobs = await sql`
      SELECT j.*, ja.approved_at
      FROM jobs j
      INNER JOIN job_approvals ja ON j.id = ja.job_id
      ORDER BY j.posted_date DESC;
    `;
    return jobs.map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: {
        city: job.location_city,
        state: job.location_state,
      },
      isRemote: job.is_remote,
      description: job.description,
      requirements: job.requirements,
      jobType: job.job_type,
      postedDate: job.posted_date,
      salary: job.salary,
      applicants: {
        total: job.applicants_total,
        filled: job.applicants_filled,
      },
      status: job.status,
      updatedAt: job.updated_at,
      contactEmail: job.contact_email,
      applyLink: job.apply_link,
      approvedAt: job.approved_at,
    }));
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
}

export async function getPendingJobs() {
  const sql = await getServerSql();
  try {
    const jobs = await sql`
      SELECT j.*
      FROM jobs j
      LEFT JOIN job_approvals ja ON j.id = ja.job_id
      WHERE ja.id IS NULL
      ORDER BY j.posted_date DESC;
    `;

    return jobs.map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: {
        city: job.location_city,
        state: job.location_state,
      },
      isRemote: job.is_remote,
      description: job.description,
      requirements: job.requirements,
      jobType: job.job_type,
      postedDate: job.posted_date,
      salary: job.salary,
      applicants: {
        total: job.applicants_total,
        filled: job.applicants_filled,
      },
      status: job.status,
      updatedAt: job.updated_at,
      contactEmail: job.contact_email,
      applyLink: job.apply_link,
      approvedAt: job.approved_at,
    }));
  } catch (error) {
    console.error("Error fetching pending jobs:", error);
    throw error;
  }
}

export async function createJobApproval(jobId: string, approverId: string) {
  const sql = await getServerSql();
  try {
    const [approval] = await sql`
      INSERT INTO job_approvals (job_id, approver_id)
      VALUES (${jobId}, ${approverId})
      RETURNING *;
    `;
    return approval;
  } catch (error) {
    console.error("Error creating job approval:", error);
    throw error;
  }
}

// Add helper function to get job approval
export async function getJobApproval(jobId: string) {
  const sql = await getServerSql();
  try {
    const [approval] = await sql`
      SELECT * FROM job_approvals
      WHERE job_id = ${jobId};
    `;
    return approval;
  } catch (error) {
    console.error("Error fetching job approval:", error);
    throw error;
  }
}

// Add this as a separate function
export async function createJobApprovalsTable() {
  const sql = await getServerSql();
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS job_approvals (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
        approver_id TEXT NOT NULL,
        approved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(job_id)
      );
    `;
    console.log("Job approvals table created successfully");
  } catch (error) {
    console.error("Error creating job approvals table:", error);
    throw error;
  }
}

export async function getRecentApprovals() {
  const sql = await getServerSql();
  try {
    const jobs = await sql`
      SELECT 
        j.*,
        ja.approved_at,
        ja.approver_id
      FROM jobs j
      INNER JOIN job_approvals ja ON j.id = ja.job_id
      ORDER BY ja.approved_at DESC
      LIMIT 20;
    `;

    return jobs.map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: {
        city: job.location_city,
        state: job.location_state,
      },
      isRemote: job.is_remote,
      description: job.description,
      requirements: job.requirements,
      jobType: job.job_type,
      postedDate: job.posted_date,
      salary: job.salary,
      applicants: {
        total: job.applicants_total,
        filled: job.applicants_filled,
      },
      status: job.status,
      updatedAt: job.updated_at,
      contactEmail: job.contact_email,
      applyLink: job.apply_link,
      approvedAt: job.approved_at,
    }));
  } catch (error) {
    console.error('Error fetching recent approvals:', error);
    throw error;
  }
}

export async function revokeJobApproval(jobId: string) {
  const sql = await getServerSql();
  try {
    await sql`
      DELETE FROM job_approvals
      WHERE job_id = ${jobId};
    `;
    return true;
  } catch (error) {
    console.error("Error revoking job approval:", error);
    throw error;
  }
}
