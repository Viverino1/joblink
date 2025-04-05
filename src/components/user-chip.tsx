import { Card } from "@/components/ui/card";

interface UserChipProps {
  firstName: string;
  lastName: string;
  imageUrl: string;
}

export function UserChip({ firstName, lastName, imageUrl }: UserChipProps) {
  return (
    <Card className="inline-flex items-center gap-1.5 p-1 pr-3 rounded-full">
      <img
        src={imageUrl}
        alt={`${firstName} ${lastName}`}
        className="w-6 h-6 rounded-full object-cover"
      />
      <span className="text-sm whitespace-nowrap">
        {firstName} {lastName}
      </span>
    </Card>
  );
}
