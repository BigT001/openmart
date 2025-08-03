import * as React from "react";
import { Button, buttonVariants } from "./button";
import { cn } from "@/lib/utils";

export interface SaveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  label?: string;
}

const SaveButton = React.forwardRef<HTMLButtonElement, SaveButtonProps>(
  ({ loading = false, label = "Save", className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        size="default"
        className={cn(
          `text-white font-bold border-none shadow-md transition-all duration-200
          hover:scale-105 hover:shadow-[0_0_16px_2px_#00968888,0_2px_8px_0_#004d40cc] hover:bg-gradient-to-r hover:from-[#009688] hover:to-[#004d40]`,
          className
        )}
        style={{
          background: 'linear-gradient(90deg, #004d40 30%, #009688 100%)',
        }}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            Saving...
          </span>
        ) : (
          label
        )}
      </Button>
    );
  }
);
SaveButton.displayName = "SaveButton";

export { SaveButton };
