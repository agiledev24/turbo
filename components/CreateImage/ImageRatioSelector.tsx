"use client";
import { cn } from "@/lib/utils";

const aspects = [
  {
    name: "Square",
    desc: "Perfect for Instagram post",
    class: "h-[80px] w-[80px]",
    type: "square",
  },
  {
    name: "Horizontal",
    desc: "Projectors, wallpapers",

    class: "h-[80px] w-[130px]",
    type: "horizontal",
  },
  {
    name: "Vertical",
    desc: "TikTok, IG Stories",
    class: "h-[80px] w-[50px]",
    type: "vertical",
  },
];

const ImageRatioSelector = ({ onClick, selectedRatio }: any) => {
  return (
    <div className="space-y-1">
      <h1 className="mb-3 text-lg text-center">Image Aspect Ratio</h1>

      <div className="flex flex-wrap gap-10">
        {aspects?.map((aspect) => (
          <div key={aspect.type} className="w-full md:w-auto">
            <div>
              <div
                onClick={() => {
                  onClick(aspect.type);
                }}
                className={cn(
                  selectedRatio === aspect.type
                    ? "border-2 border-white hover:border-white"
                    : "border-2 border-border hover:border-primary",
                  "items-center p-1  rounded-md bg-popover hover:cursor-pointer"
                )}
              >
                <div className="p-2 space-y-2 rounded-sm bg-slate-950">
                  <div className="flex items-center justify-center p-2 space-y-2 rounded-md shadow-sm">
                    <div className={`${aspect.class} rounded-lg bg-primary`} />
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start">
                <span className="w-full p-2 font-semibold">{aspect.name}</span>

                <span className="w-full p-2 pt-0 font-normal text-secondary-foreground">
                  {aspect.desc}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { ImageRatioSelector };
