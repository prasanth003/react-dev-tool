import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from "@/components/ui/menubar";

export default function Header() {
  return (

    <div className="w-full bg-slate-800 px-4 py-2 flex justify-between items-center border-b border-slate-700">

        <Menubar>
            <MenubarMenu>
                
                <MenubarTrigger>Play</MenubarTrigger>
                <MenubarSeparator />
                <MenubarTrigger>Pause</MenubarTrigger>
                <MenubarSeparator />
                <MenubarTrigger>Clear</MenubarTrigger>

            </MenubarMenu>

        </Menubar>

    </div>

  );
}