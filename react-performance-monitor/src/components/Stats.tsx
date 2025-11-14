type Props = {
    totalRenders?: number;
    totalComponents?: number;
    totalIssues?: number;
};

export function Stats({ totalRenders = 0, totalComponents = 0, totalIssues = 0 }: Props) {
    return (
        <div className="border-b border-[#cccccc1f] pl-4 flex items-center justify-between">

            <div className="text-left w-fit">


                <div className="text-left">

                    <p className="text-primary text-[12px] font-mono">Performance Analysis</p>
                    <p className="text-[10px] text-[#ada8a8] font-mono">
                        Analyzing the performance of your React application helps identify bottlenecks and optimize rendering efficiency.
                    </p>

                </div>

            </div>

            <div className="flex items-center">

                <div className="text-left border-l border-[#cccccc1f] p-4 w-30 hover:bg-accent/50">
                    <p className="text-[12px] text-[#ada8a8] font-mono">Renders</p>
                    <h1 className="text-[24px] font-extrabold text-[#ccc] font-mono">{totalRenders}</h1>
                </div>

                <div className="text-left border-l border-[#cccccc1f] p-4 w-30 hover:bg-accent/50">
                    <p className="text-[12px] text-[#ada8a8] font-mono">Components</p>
                    <h1 className="text-[24px] font-extrabold text-[#ccc] font-mono">{totalComponents}</h1>
                </div>

                <div className="text-left border-l border-[#cccccc1f] p-4 w-30 hover:bg-accent/50">
                    <p className="text-[12px] text-[#ada8a8] font-mono">Issues</p>
                    <h1 className="text-[24px] font-extrabold text-[#ccc] font-mono">{totalIssues}</h1>
                </div>

            </div>

        </div>
    );
}