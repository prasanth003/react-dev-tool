import { useEffect, useState } from "react";
import type { ComponentData, DetectionResult, PerformanceIssue, RenderEvents } from "./shared/types";

import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Badge } from './components/ui/badge';
import { Input } from './components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { ScrollArea } from './components/ui/scroll-area';
import { Separator } from './components/ui/separator';

import {
  Play,
  Pause,
  Trash2,
  Download,
  Activity,
  AlertTriangle,
  TrendingUp,
  Zap,
  CheckCircle2,
  Search,
  BarChart3
} from 'lucide-react';



function Panel() {

  const [reactDetected, setReactDetected] = useState<DetectionResult>({ detected: false, method: null, version: null });
  const [components, setComponents] = useState<ComponentData[]>([]);
  const [issues, setIssues] = useState<PerformanceIssue[]>([]);
  const [totalRenders, setTotalRenders] = useState(0);
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'components' | 'issues'>('components');
  const [isRecording, setIsRecording] = useState(true);
  const [sortBy, setSortBy] = useState<'renders' | 'time' | 'name'>('renders');
  const [filterText, setFilterText] = useState('');


  useEffect(() => {

    const messageListener = (message: any) => {

      if (message.type === 'REACT_DETECTED') {
        setReactDetected(message.data);
      }

      if (message.type === 'COMPONENT_DATA') {
        const renderData = message.data as RenderEvents;
        setTotalRenders(renderData.renderCount);
        setComponents(renderData.components);
        setIssues(message.data.issues || []);
      }

    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };

  }, []);

  const handleMouseEnter = (componentId: string) => {
    setHoveredComponent(componentId);

    // Send highlight request to content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'HIGHLIGHT_COMPONENT',
          componentId: componentId
        });
      }
    });
  };

  const handleMouseLeave = () => {
    setHoveredComponent(null);

    // Send unhighlight request
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'UNHIGHLIGHT_COMPONENT'
        });
      }
    });
  };

  const handleClearData = () => {
    setTotalRenders(0);
    setComponents([]);
    setIssues([]);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'CLEAR_TRACKING_DATA'
        });
      }
    });
  };

  const handleExportReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      reactVersion: reactDetected?.version,
      totalRenders,
      components: components.map(c => ({
        name: c.name,
        renders: c.renderCount,
        avgTime: c.averageRenderTime.toFixed(2) + 'ms',
        slowestRender: c.slowestRender.toFixed(2) + 'ms'
      })),
      issues: issues.map(i => ({
        component: i.componentName,
        severity: i.severity,
        type: i.type,
        message: i.message,
        suggestion: i.suggestion
      }))
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `react-perf-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredComponents = components
    .filter(c => c.name.toLowerCase().includes(filterText.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'renders':
          return b.renderCount - a.renderCount;
        case 'time':
          return b.averageRenderTime - a.averageRenderTime;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const getSeverityVariant = (severity: string): "default" | "destructive" | "secondary" => {
    if (severity === 'high') return 'destructive';
    if (severity === 'medium') return 'default';
    return 'secondary';
  };


  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-50">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                React Performance Monitor
              </h1>
              <p className="text-xs text-slate-400">
                Real-time component profiling
              </p>
            </div>
          </div>

          {reactDetected?.detected ? (
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              React {reactDetected.version}
            </Badge>
          ) : (
            <Badge variant="destructive">
              <AlertTriangle className="h-3 w-3 mr-1" />
              No React
            </Badge>
          )}
        </div>

        {/* Controls Bar */}
        <div className="flex items-center gap-3 px-6 pb-4">
          <Button
            variant={isRecording ? "destructive" : "default"}
            size="sm"
            onClick={() => setIsRecording(!isRecording)}
            className="gap-2"
          >
            {isRecording ? (
              <>
                <Pause className="h-3.5 w-3.5" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" />
                Record
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleClearData}
            className="gap-2 border-slate-700 hover:bg-slate-800"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportReport}
            disabled={components.length === 0}
            className="gap-2 border-slate-700 hover:bg-slate-800"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>

          <Separator orientation="vertical" className="h-8 bg-slate-700" />

          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Filter components..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="pl-9 bg-slate-800 border-slate-700 focus-visible:ring-purple-500"
            />
          </div>

          {/* Sort */}
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-[140px] bg-slate-800 border-slate-700">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              <SelectItem value="renders">By Renders</SelectItem>
              <SelectItem value="time">By Time</SelectItem>
              <SelectItem value="name">By Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 p-6">
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-400">
                Total Renders
              </CardTitle>
              <Activity className="h-4 w-4 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {totalRenders.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-400">
                Components
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">
              {components.length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-400">
                Issues Found
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${issues.length > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              {issues.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex-1 overflow-hidden px-6 pb-6">
        <Tabs value={selectedTab} onValueChange={(value: any) => setSelectedTab(value)} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 bg-slate-900 border border-slate-800">
            <TabsTrigger
              value="components"
              className="data-[state=active]:bg-purple-500 data-[state=active]:text-white gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Components
              <Badge variant="secondary" className="ml-auto bg-slate-800">
                {components.length}
              </Badge>
            </TabsTrigger>

            <TabsTrigger
              value="issues"
              className="data-[state=active]:bg-purple-500 data-[state=active]:text-white gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              Issues
              {issues.length > 0 && (
                <Badge variant="destructive" className="ml-auto">
                  {issues.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Components Tab */}
          <TabsContent value="components" className="flex-1 mt-4 overflow-hidden">
            <Card className="h-full bg-slate-900/50 border-slate-800">
              <ScrollArea className="h-full">
                {filteredComponents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <Activity className="h-16 w-16 mb-4 opacity-30" />
                    <p className="text-lg font-medium mb-2">No components yet</p>
                    <p className="text-sm text-slate-500">
                      Interact with the page to see render data
                    </p>
                  </div>
                ) : (
                  <div className="p-4 space-y-2">
                    {filteredComponents.map((comp) => (
                      <Card
                        key={comp.id}
                        className={`cursor-pointer transition-all border-slate-800 ${hoveredComponent === comp.id
                            ? 'bg-slate-800 border-purple-500/50'
                            : 'bg-slate-900/50 hover:bg-slate-800/50'
                          }`}
                        onMouseEnter={() => handleMouseEnter(comp.id)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-mono font-semibold text-sm truncate">
                                {comp.name}
                              </h3>
                              <p className="text-xs text-slate-500 mt-1">
                                Last render: {new Date(comp.timestamp).toLocaleTimeString()}
                              </p>
                            </div>

                            <div className="flex items-center gap-6">
                              <div className="text-right">
                                <div className="text-xs text-slate-400 mb-1">
                                  Renders
                                </div>
                                <Badge
                                  variant={comp.renderCount > 20 ? "destructive" : "default"}
                                  className="font-mono"
                                >
                                  {comp.renderCount}
                                </Badge>
                              </div>

                              <div className="text-right">
                                <div className="text-xs text-slate-400 mb-1">
                                  Avg Time
                                </div>
                                <Badge
                                  variant={comp.averageRenderTime > 16 ? "destructive" : "default"}
                                  className="font-mono"
                                >
                                  {comp.averageRenderTime.toFixed(1)}ms
                                </Badge>
                              </div>

                              <div className="text-right">
                                <div className="text-xs text-slate-400 mb-1">
                                  Slowest
                                </div>
                                <Badge
                                  variant="secondary"
                                  className="font-mono bg-slate-800"
                                >
                                  {comp.slowestRender.toFixed(1)}ms
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </Card>
          </TabsContent>

          {/* Issues Tab */}
          <TabsContent value="issues" className="flex-1 mt-4 overflow-hidden">
            <ScrollArea className="h-full">
              {issues.length === 0 ? (
                <Card className="bg-emerald-500/10 border-emerald-500/20">
                  <CardContent className="flex flex-col items-center justify-center py-20">
                    <CheckCircle2 className="h-16 w-16 text-emerald-400 mb-4" />
                    <h3 className="text-xl font-semibold text-emerald-400 mb-2">
                      All Clear!
                    </h3>
                    <p className="text-sm text-emerald-400/70">
                      No performance issues detected
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {issues.map((issue, idx) => (
                    <Card
                      key={idx}
                      className={`border-l-4 ${issue.severity === 'high'
                          ? 'border-l-red-500 bg-red-500/5'
                          : issue.severity === 'medium'
                            ? 'border-l-amber-500 bg-amber-500/5'
                            : 'border-l-emerald-500 bg-emerald-500/5'
                        } border-t border-r border-b border-slate-800 cursor-pointer transition-all hover:bg-slate-800/50`}
                      onMouseEnter={() => handleMouseEnter(issue.componentId)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="font-mono text-base mb-2">
                              {issue.componentName}
                            </CardTitle>
                            <p className="text-sm text-slate-400">
                              {issue.message}
                            </p>
                          </div>
                          <Badge variant={getSeverityVariant(issue.severity)}>
                            {issue.severity.toUpperCase()}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                          <p className="text-sm text-slate-300 flex items-start gap-2">
                            <span className="text-lg">💡</span>
                            <span>
                              <strong className="text-purple-400">Suggestion:</strong>{' '}
                              {issue.suggestion}
                            </span>
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Panel;