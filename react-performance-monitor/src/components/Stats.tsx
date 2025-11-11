export function Stats() {
    return (
        <div className="border-b border-[#cccccc1f] pl-4 flex items-center justify-between">

            <div className="text-left">

                <p className="text-primary text-[14px]">Performance Analysis</p>
                <p className="text-[12px] text-[#ada8a8]">
                    Analyzing the performance of your React application helps identify bottlenecks and optimize rendering efficiency.
                </p>

            </div>

            <div className="flex items-center">

                <div className="text-left border-l border-[#cccccc1f] p-4 w-30 hover:bg-accent/50">
                    <p className="text-[12px] text-[#ada8a8]">Renders</p>
                    <h1 className="text-[24px] font-extrabold text-[#ccc]">245</h1>
                </div>

                <div className="text-left border-l border-[#cccccc1f] p-4 w-30 hover:bg-accent/50">
                    <p className="text-[12px] text-[#ada8a8]">Components</p>
                    <h1 className="text-[24px] font-extrabold text-[#ccc]">30</h1>
                </div>

                <div className="text-left border-l border-[#cccccc1f] p-4 w-30 hover:bg-accent/50">
                    <p className="text-[12px] text-[#ada8a8]">Issues</p>
                    <h1 className="text-[24px] font-extrabold text-[#ccc]">10</h1>
                </div>

            </div>

        </div>
    );
}