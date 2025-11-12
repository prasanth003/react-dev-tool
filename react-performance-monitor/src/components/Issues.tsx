import type { PerformanceIssue } from "@/shared/types";
import { AlertCircle, AlertTriangle, EyeOff, Info, RefreshCw, Zap } from "lucide-react";
import { Badge } from "./ui/badge";

type Props = {
    issues: PerformanceIssue[];
}

export function Issues({ issues }: Props) {

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'high': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'low': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'high': return <AlertCircle className="w-3 h-3" />;
            case 'medium': return <AlertTriangle className="w-3 h-3" />;
            case 'low': return <Info className="w-3 h-3" />;
            default: return <Info className="w-3 h-3" />;
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'slow-render': return <Zap className="w-3 h-3" />;
            case 'excessive-renders': return <RefreshCw className="w-3 h-3" />;
            case 'unnecessary-render': return <EyeOff className="w-3 h-3" />;
            default: return <AlertCircle className="w-3 h-3" />;
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'slow-render': return 'Slow Render';
            case 'excessive-renders': return 'Excessive Renders';
            case 'unnecessary-render': return 'Unnecessary Render';
            default: return type;
        }
    };

    return (

        <div className="w-full bg-accent/70 text-zinc-100 p-0 text-[11px] font-mono">
            <div className="border-b border-zinc-800 px-2 py-1.5 bg-zinc-900">
                <div className="flex items-center justify-between">
                    <span className="font-medium text-[12px]">Performance Issues ({issues.length})</span>
                    <div className="flex gap-1.5">
                        <Badge variant="outline" className="h-4 px-1.5 text-[10px] border-red-500/30 text-red-400">
                            {issues.filter(i => i.severity === 'high').length} High
                        </Badge>
                        <Badge variant="outline" className="h-4 px-1.5 text-[10px] border-yellow-500/30 text-yellow-400">
                            {issues.filter(i => i.severity === 'medium').length} Med
                        </Badge>
                        <Badge variant="outline" className="h-4 px-1.5 text-[10px] border-blue-500/30 text-blue-400">
                            {issues.filter(i => i.severity === 'low').length} Low
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="divide-y divide-zinc-800 h-[calc(100vh-170px)] min-h-36 overflow-y-auto">
                {issues.length === 0 ? (
                    <div className="p-4 text-center text-zinc-500 text-[11px]">
                        No performance issues detected
                    </div>
                ) : (
                    issues.map((issue, index) => (
                        <div key={`${issue.componentId}-${index}`} className="p-2 hover:bg-zinc-900/50 transition-colors">
                            <div className="flex items-start gap-2">
                                <div className={`flex items-center justify-center w-5 h-5 rounded ${getSeverityColor(issue.severity)}`}>
                                    {getSeverityIcon(issue.severity)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <span className="font-semibold text-zinc-100 text-[11px] truncate">
                                            {issue.componentName}
                                        </span>
                                        <span className="text-zinc-600 text-[10px]">#{issue.componentId}</span>
                                    </div>

                                    <div className="flex items-center gap-1.5 mb-1.5">
                                        <Badge variant="outline" className="h-4 px-1.5 text-[9px] border-zinc-700 text-zinc-400">
                                            <span className="mr-1">{getTypeIcon(issue.type)}</span>
                                            {getTypeLabel(issue.type)}
                                        </Badge>
                                        <Badge variant="outline" className={`h-4 px-1.5 text-[9px] border ${getSeverityColor(issue.severity)}`}>
                                            {issue.severity.toUpperCase()}
                                        </Badge>
                                    </div>

                                    <div className="text-zinc-400 text-[11px] mb-1.5 leading-relaxed text-left">
                                        {issue.message}
                                    </div>

                                    <div className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-[10px] text-zinc-300 leading-relaxed font-mono text-left">
                                        <span className="text-emerald-400 font-semibold">💡 </span>
                                        {issue.suggestion}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}