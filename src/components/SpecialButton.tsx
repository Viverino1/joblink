export default function SpecialButton(props: { children: React.ReactNode }) {
  return (
    <button className=" relative inline-flex overflow-hidden rounded-md p-[1px] focus:outline-none">
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00A6A6_0%,#BBDEF0_50%,#00A6A6_100%)]" />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-md bg-background px-2  py-0.5 md:px-3 md:py-1.5 text-sm font-medium text-foreground backdrop-blur-3xl whitespace-nowrap">
        {props.children}
      </span>
    </button>
  );
}
