import { cn } from "../../utils/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "outline" | "danger" | "ghost";
};

export default function Button({ variant = "default", className, ...props }: ButtonProps) {
    const base =
        "px-4 py-2 rounded-md font-medium text-sm transition-colors cursor-pointer select-none";

    const variants: Record<string, string> = {
        default: "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800",
        outline:
            "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 active:bg-slate-200",
        danger:
            "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800",
        ghost:
            "bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200",
    };

    return (
        <button
            className={cn(base, variants[variant], className)}
            {...props}
        />
    );
}
