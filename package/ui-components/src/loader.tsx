import { cn } from "@/lib/utils";
import { Loader as LoaderIcon } from "lucide-react";

function Loader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("animate-spin text-primary", className)} {...props}>
      <LoaderIcon />
    </div>
  );
}

export { Loader };
