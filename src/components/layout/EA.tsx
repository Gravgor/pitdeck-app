import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export default function EA() {
    return (
        <div className="min-h-12 py-2 bg-yellow-500/10 border-b border-yellow-500/20 flex items-center">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 text-center">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 animate-pulse" />
                        <span className="text-xs sm:text-sm font-medium text-yellow-500">Alpha Version</span>
                    </div>
                    <span className="text-[10px] sm:text-sm text-gray-400 px-2">
                        This is an early access release. Features may be unstable and data might be reset.
                    </span>
                    <Link
                        href="/roadmap"
                        className="flex items-center text-xs sm:text-sm text-yellow-500 hover:text-yellow-400 font-medium"
                    >
                        View Roadmap
                        <ArrowRight className="inline-block ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                    </Link>
                </div>
            </div>
        </div>
    )
}