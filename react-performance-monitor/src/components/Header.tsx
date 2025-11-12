import {
    ButtonGroup,
    ButtonGroupSeparator
} from "@/components/ui/button-group"
import {
    Play,
    Pause,
    RotateCcw,
    FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"

export type Actions = 'start' | 'pause' | 'reset' | 'export';

type HeaderProps = {
    onAction: (action: Actions) => void;
    isMonitoring: boolean;
}

export function Header({ onAction, isMonitoring }: HeaderProps) {

    return (
        <div className="flex items-center justify-between border-b-1 border-[#cccccc1f] py-0 pl-4">

            <h6 className="text-[#ada8a8] text-[12px] font-semibold">React Performance Monitor</h6>

            <ButtonGroup className="bg-transparent">
                <Button variant={isMonitoring ? "destructive" : "default"} className="bg-transparent text-xs text-primary hover:bg-accent cursor-pointer font-mono" onClick={() => { onAction('start') }}>
                    <Play className="size-3.5" /> Start
                </Button>
                <ButtonGroupSeparator></ButtonGroupSeparator>
                <Button  variant={!isMonitoring ? "destructive" : "default"} className="bg-transparent text-xs text-primary hover:bg-accent cursor-pointer font-mono" onClick={() => { onAction('pause') }}>
                    <Pause className="size-3.5" /> Pause
                </Button>
                <ButtonGroupSeparator></ButtonGroupSeparator>
                <Button className="bg-transparent text-xs text-primary hover:bg-accent cursor-pointer font-mono" onClick={() => { onAction('reset') }}>
                    <RotateCcw className="size-3.5" /> Reset
                </Button>
                <ButtonGroupSeparator></ButtonGroupSeparator>
                <Button className="bg-transparent text-xs text-primary hover:bg-accent cursor-pointer font-mono" onClick={() => { onAction('export') }}>
                    <FileText className="size-3.5" /> Export
                </Button>
            </ButtonGroup>

        </div>
    );

}