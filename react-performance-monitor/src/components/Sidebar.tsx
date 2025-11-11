import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useState } from "react";

type Tab = "overview" | "issues" | "performance";

type TabProps = {
    id: Tab;
    label: string;
}

export function Sidebar() {

    const [activeTab, setActiveTab] = useState<Tab>("overview");

    const tabs: TabProps[] = [
        { id: "overview", label: "Overview" },
        { id: "issues", label: "Issues" },
        { id: "performance", label: "Performance" },
    ];

    return (
        <ButtonGroup orientation="vertical" className="w-full">
            {tabs.map((tab, i) => (
                <Button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={[
                        "w-full text-[12px] bg-transparent text-primary",
                        "hover:bg-accent/50 transition-colors",
                        i !== tabs.length - 1 && "border-b border-[#cccccc1f]",
                        activeTab === tab.id && "bg-accent/50 text-accent-foreground",
                    ]
                        .filter(Boolean)
                        .join(" ")}
                >
                    {tab.label}
                </Button>
            ))}

        </ButtonGroup>
    );

}