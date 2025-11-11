import { useState } from 'react';
import Header from './components/dev-panels/Header';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Badge } from '@/components/ui/badge';
// import { Input } from '@/components/ui/input';
// import { 
//   Select, 
//   SelectContent, 
//   SelectItem, 
//   SelectTrigger, 
//   SelectValue 
// } from '@/components/ui/select';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Separator } from '@/components/ui/separator';
// import { 
//   Activity,
//   AlertTriangle,
//   BarChart3,
//   CheckCircle2,
//   Download,
//   Pause,
//   Play,
//   Search,
//   Trash2,
//   Zap,
//   TrendingUp,
// } from 'lucide-react';

// Mock data for development
const mockComponents = [
  { id: '1', name: 'App', renderCount: 15, averageRenderTime: 12.5, slowestRender: 25.3, lastRenderTime: Date.now() },
  { id: '2', name: 'Header', renderCount: 32, averageRenderTime: 3.2, slowestRender: 8.1, lastRenderTime: Date.now() },
  { id: '3', name: 'Counter', renderCount: 48, averageRenderTime: 18.7, slowestRender: 45.2, lastRenderTime: Date.now() },
  { id: '4', name: 'TodoList', renderCount: 23, averageRenderTime: 14.3, slowestRender: 32.1, lastRenderTime: Date.now() },
  { id: '5', name: 'SearchBar', renderCount: 67, averageRenderTime: 22.4, slowestRender: 58.9, lastRenderTime: Date.now() },
];

const mockIssues = [
  {
    componentId: '3',
    componentName: 'Counter',
    type: 'slow-render',
    severity: 'high' as const,
    message: 'Average render time is 18.7ms (target: <16ms)',
    suggestion: 'Use useMemo() for expensive calculations or React.memo() to prevent unnecessary renders'
  },
  {
    componentId: '5',
    componentName: 'SearchBar',
    type: 'excessive-renders',
    severity: 'high' as const,
    message: 'Rendered 67 times',
    suggestion: 'Add debouncing to search input to reduce render frequency'
  },
  {
    componentId: '2',
    componentName: 'Header',
    type: 'excessive-renders',
    severity: 'medium' as const,
    message: 'Rendered 32 times',
    suggestion: 'Wrap with React.memo() or check if parent is causing unnecessary re-renders'
  },
];

function PanelLayout() {
//   const [isRecording, setIsRecording] = useState(true);
//   const [selectedTab, setSelectedTab] = useState<'components' | 'issues'>('components');
//   const [sortBy, setSortBy] = useState<'renders' | 'time' | 'name'>('renders');
//   const [filterText, setFilterText] = useState('');
//   const [hoveredComponent, setHoveredComponent] = useState<string | null>(null);

//   const filteredComponents = mockComponents
//     .filter(c => c.name.toLowerCase().includes(filterText.toLowerCase()))
//     .sort((a, b) => {
//       switch (sortBy) {
//         case 'renders':
//           return b.renderCount - a.renderCount;
//         case 'time':
//           return b.averageRenderTime - a.averageRenderTime;
//         case 'name':
//           return a.name.localeCompare(b.name);
//         default:
//           return 0;
//       }
//     });

//   const getSeverityVariant = (severity: string): "default" | "destructive" | "secondary" => {
//     if (severity === 'high') return 'destructive';
//     if (severity === 'medium') return 'default';
//     return 'secondary';
//   };

  return (

    <div className='font-devtools flex h-screen bg-slate-950 text-slate-50 m-8'>
      
      <Header />

      <div className='flex-1 flex items-center justify-center'>
        <h2 className='text-2xl font-semibold text-slate-400'>
          Panel Development in Progress...
        </h2>
      </div>

    </div>
    

    // <div className="flex flex-col h-screen bg-slate-950 text-slate-50">
    //   {/* Header */}
    //   <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
    //     <div className="flex items-center justify-between px-6 py-4">
    //       <div className="flex items-center gap-3">
    //         <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
    //           <Zap className="h-5 w-5 text-white" />
    //         </div>
    //         <div>
    //           <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
    //             React Performance Monitor
    //           </h1>
    //           <p className="text-xs text-slate-400">
    //             Real-time component profiling • Dev Mode
    //           </p>
    //         </div>
    //       </div>
          
    //       <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
    //         <CheckCircle2 className="h-3 w-3 mr-1" />
    //         React 18.3.1
    //       </Badge>
    //     </div>

    //     {/* Controls Bar */}
    //     <div className="flex items-center gap-3 px-6 pb-4">
    //       <Button
    //         variant={isRecording ? "destructive" : "default"}
    //         size="sm"
    //         onClick={() => setIsRecording(!isRecording)}
    //         className="gap-2"
    //       >
    //         {isRecording ? (
    //           <>
    //             <Pause className="h-3.5 w-3.5" />
    //             Pause
    //           </>
    //         ) : (
    //           <>
    //             <Play className="h-3.5 w-3.5" />
    //             Record
    //           </>
    //         )}
    //       </Button>

    //       <Button
    //         variant="outline"
    //         size="sm"
    //         onClick={() => alert('Clear data')}
    //         className="gap-2 border-slate-700 hover:bg-slate-800"
    //       >
    //         <Trash2 className="h-3.5 w-3.5" />
    //         Clear
    //       </Button>

    //       <Button
    //         variant="outline"
    //         size="sm"
    //         onClick={() => alert('Export report')}
    //         className="gap-2 border-slate-700 hover:bg-slate-800"
    //       >
    //         <Download className="h-3.5 w-3.5" />
    //         Export
    //       </Button>

    //       <Separator orientation="vertical" className="h-8 bg-slate-700" />

    //       {/* Search */}
    //       <div className="relative flex-1 max-w-xs">
    //         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
    //         <Input
    //           placeholder="Filter components..."
    //           value={filterText}
    //           onChange={(e) => setFilterText(e.target.value)}
    //           className="pl-9 bg-slate-800 border-slate-700 focus-visible:ring-purple-500"
    //         />
    //       </div>

    //       {/* Sort */}
    //       <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
    //         <SelectTrigger className="w-[140px] bg-slate-800 border-slate-700">
    //           <SelectValue placeholder="Sort by..." />
    //         </SelectTrigger>
    //         <SelectContent className="bg-slate-900 border-slate-700">
    //           <SelectItem value="renders">By Renders</SelectItem>
    //           <SelectItem value="time">By Time</SelectItem>
    //           <SelectItem value="name">By Name</SelectItem>
    //         </SelectContent>
    //       </Select>
    //     </div>
    //   </div>

    //   {/* Stats Cards */}
    //   <div className="grid grid-cols-3 gap-4 p-6">
    //     <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
    //       <CardHeader className="pb-3">
    //         <div className="flex items-center justify-between">
    //           <CardTitle className="text-sm font-medium text-slate-400">
    //             Total Renders
    //           </CardTitle>
    //           <Activity className="h-4 w-4 text-purple-400" />
    //         </div>
    //       </CardHeader>
    //       <CardContent>
    //         <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
    //           185
    //         </div>
    //       </CardContent>
    //     </Card>

    //     <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
    //       <CardHeader className="pb-3">
    //         <div className="flex items-center justify-between">
    //           <CardTitle className="text-sm font-medium text-slate-400">
    //             Components
    //           </CardTitle>
    //           <BarChart3 className="h-4 w-4 text-blue-400" />
    //         </div>
    //       </CardHeader>
    //       <CardContent>
    //         <div className="text-3xl font-bold text-blue-400">
    //           {mockComponents.length}
    //         </div>
    //       </CardContent>
    //     </Card>

    //     <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
    //       <CardHeader className="pb-3">
    //         <div className="flex items-center justify-between">
    //           <CardTitle className="text-sm font-medium text-slate-400">
    //             Issues Found
    //           </CardTitle>
    //           <AlertTriangle className="h-4 w-4 text-amber-400" />
    //         </div>
    //       </CardHeader>
    //       <CardContent>
    //         <div className="text-3xl font-bold text-red-400">
    //           {mockIssues.length}
    //         </div>
    //       </CardContent>
    //     </Card>
    //   </div>

    //   {/* Tabs */}
    //   <div className="flex-1 overflow-hidden px-6 pb-6">
    //     <Tabs value={selectedTab} onValueChange={(value: any) => setSelectedTab(value)} className="h-full flex flex-col">
    //       <TabsList className="grid w-full grid-cols-2 bg-slate-900 border border-slate-800">
    //         <TabsTrigger 
    //           value="components" 
    //           className="data-[state=active]:bg-purple-500 data-[state=active]:text-white gap-2"
    //         >
    //           <TrendingUp className="h-4 w-4" />
    //           Components
    //           <Badge variant="secondary" className="ml-auto bg-slate-800">
    //             {mockComponents.length}
    //           </Badge>
    //         </TabsTrigger>
            
    //         <TabsTrigger 
    //           value="issues" 
    //           className="data-[state=active]:bg-purple-500 data-[state=active]:text-white gap-2"
    //         >
    //           <AlertTriangle className="h-4 w-4" />
    //           Issues
    //           <Badge variant="destructive" className="ml-auto">
    //             {mockIssues.length}
    //           </Badge>
    //         </TabsTrigger>
    //       </TabsList>

    //       {/* Components Tab */}
    //       <TabsContent value="components" className="flex-1 mt-4 overflow-hidden">
    //         <Card className="h-full bg-slate-900/50 border-slate-800">
    //           <ScrollArea className="h-full">
    //             <div className="p-4 space-y-2">
    //               {filteredComponents.map((comp) => (
    //                 <Card
    //                   key={comp.id}
    //                   className={`cursor-pointer transition-all border-slate-800 ${
    //                     hoveredComponent === comp.id 
    //                       ? 'bg-slate-800 border-purple-500/50' 
    //                       : 'bg-slate-900/50 hover:bg-slate-800/50'
    //                   }`}
    //                   onMouseEnter={() => setHoveredComponent(comp.id)}
    //                   onMouseLeave={() => setHoveredComponent(null)}
    //                 >
    //                   <CardContent className="p-4">
    //                     <div className="flex items-center justify-between gap-4">
    //                       <div className="flex-1 min-w-0">
    //                         <h3 className="font-mono font-semibold text-sm truncate">
    //                           {comp.name}
    //                         </h3>
    //                         <p className="text-xs text-slate-500 mt-1">
    //                           Last render: {new Date(comp.lastRenderTime).toLocaleTimeString()}
    //                         </p>
    //                       </div>
                          
    //                       <div className="flex items-center gap-6">
    //                         <div className="text-right">
    //                           <div className="text-xs text-slate-400 mb-1">
    //                             Renders
    //                           </div>
    //                           <Badge 
    //                             variant={comp.renderCount > 20 ? "destructive" : "default"}
    //                             className="font-mono"
    //                           >
    //                             {comp.renderCount}
    //                           </Badge>
    //                         </div>
                            
    //                         <div className="text-right">
    //                           <div className="text-xs text-slate-400 mb-1">
    //                             Avg Time
    //                           </div>
    //                           <Badge 
    //                             variant={comp.averageRenderTime > 16 ? "destructive" : "default"}
    //                             className="font-mono"
    //                           >
    //                             {comp.averageRenderTime.toFixed(1)}ms
    //                           </Badge>
    //                         </div>

    //                         <div className="text-right">
    //                           <div className="text-xs text-slate-400 mb-1">
    //                             Slowest
    //                           </div>
    //                           <Badge 
    //                             variant="secondary"
    //                             className="font-mono bg-slate-800"
    //                           >
    //                             {comp.slowestRender.toFixed(1)}ms
    //                           </Badge>
    //                         </div>
    //                       </div>
    //                     </div>
    //                   </CardContent>
    //                 </Card>
    //               ))}
    //             </div>
    //           </ScrollArea>
    //         </Card>
    //       </TabsContent>

    //       {/* Issues Tab */}
    //       <TabsContent value="issues" className="flex-1 mt-4 overflow-hidden">
    //         <ScrollArea className="h-full">
    //           <div className="space-y-3">
    //             {mockIssues.map((issue, idx) => (
    //               <Card 
    //                 key={idx}
    //                 className={`border-l-4 ${
    //                   issue.severity === 'high' 
    //                     ? 'border-l-red-500 bg-red-500/5' 
    //                     : issue.severity === 'medium'
    //                     ? 'border-l-amber-500 bg-amber-500/5'
    //                     : 'border-l-emerald-500 bg-emerald-500/5'
    //                 } border-t border-r border-b border-slate-800 cursor-pointer transition-all hover:bg-slate-800/50`}
    //               >
    //                 <CardHeader>
    //                   <div className="flex items-start justify-between gap-4">
    //                     <div className="flex-1">
    //                       <CardTitle className="font-mono text-base mb-2">
    //                         {issue.componentName}
    //                       </CardTitle>
    //                       <p className="text-sm text-slate-400">
    //                         {issue.message}
    //                       </p>
    //                     </div>
    //                     <Badge variant={getSeverityVariant(issue.severity)}>
    //                       {issue.severity.toUpperCase()}
    //                     </Badge>
    //                   </div>
    //                 </CardHeader>
    //                 <CardContent>
    //                   <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
    //                     <p className="text-sm text-slate-300 flex items-start gap-2">
    //                       <span className="text-lg">💡</span>
    //                       <span>
    //                         <strong className="text-purple-400">Suggestion:</strong>{' '}
    //                         {issue.suggestion}
    //                       </span>
    //                     </p>
    //                   </div>
    //                 </CardContent>
    //               </Card>
    //             ))}
    //           </div>
    //         </ScrollArea>
    //       </TabsContent>
    //     </Tabs>
    //   </div>
    // </div>
  );
}

export default PanelLayout;