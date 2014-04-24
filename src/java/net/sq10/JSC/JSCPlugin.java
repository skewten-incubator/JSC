package net.sq10.JSC;

import java.io.File;
import java.io.FileReader;
import java.io.FileOutputStream;
import java.io.IOException;
import javax.script.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.ArrayList;
import java.util.List;

import org.bukkit.event.Listener;
import org.bukkit.command.Command;
import org.bukkit.command.CommandSender;
import org.bukkit.plugin.java.JavaPlugin;

//Test import. Not used just yet
import com.google.gson.Gson;

import net.sq10.JSC.Metrics;
import net.sq10.JSC.AbstractCommand;

public class JSCPlugin extends JavaPlugin implements Listener{
    private static final String JS_PLUGINS_DIR = "plugins/jsc";
    private static final String JS_PLUGINS_COREZIP = "js_core.zip";
    private static final String JS_PLUGINS_EXTRAZIP = "js_extra.zip";
    private ScriptEngine engine = new ScriptEngineManager().getEngineByName("JavaScript");
    private Invocable invocable = (Invocable) engine;
    private File plugindir = new File(JS_PLUGINS_DIR);
    private JavaPlugin pluginInstance;

    @Override
    public void onEnable(){
        //Make pluginInstance this.
        pluginInstance = this;
        //Enable Metrics.
        try{
            Metrics metrics = new Metrics(this);
            metrics.start();
        }
        catch (IOException e) {
            getLogger().warning("Couldn't enable Metrics!");
        }

        //Set up the directory.
        initDir();

        //Check if all files are intact. False for "we're not updating".
        checkFiles(false);

        //Try to read the jsc.js file, and run the __onEnable function.
        FileReader reader = null;
        try{
            reader = new FileReader(new File(JS_PLUGINS_DIR+"/lib/jsc.js"));
            engine.eval(reader);
            invocable.invokeFunction("__onEnable", engine, this, new File(JS_PLUGINS_DIR+"/lib/"));
        }
        catch(Exception e){
            e.printStackTrace();
        }
        finally{
            if (reader != null){
                try{
                    reader.close();
                }
                catch(IOException ioe){
                }
            }
        }
    }

    //Handle tab completions.
    public List<String> onTabComplete(CommandSender sender, Command cmd, String alias, String[] args){
        List<String> result = new ArrayList<String>();
        try{
            invocable.invokeFunction("__tabComplete", result, sender, cmd, alias, args);
        }
        catch (Exception e){
            sender.sendMessage(e.getMessage());
            e.printStackTrace();
        }
        return result;
    }

    //Handle commands.
    public boolean onCommand(CommandSender sender, Command cmd, String label, String[] args){
        Object jsResult = null;
        try{
            jsResult = invocable.invokeFunction("__onCommand", sender, cmd, label, args);
        }
        catch (Exception se){
            getLogger().severe(se.toString());
            se.printStackTrace();
            sender.sendMessage(se.getMessage());
        }
        if (jsResult != null){
            return ((Boolean)jsResult).booleanValue();
        }
        return false;
    }

    //Initializes the plugin's directory.
    private void initDir(){
        if (!plugindir.exists() || !plugindir.isDirectory()){
            getLogger().warning("Directory "+JS_PLUGINS_DIR+" does not exist or is a file, assuming fresh install.");
            if (plugindir.exists()){
                plugindir.delete();
            }
            plugindir.mkdirs();
            checkFiles(false);

            //Don't install the extra files. I'm going to do something different later.
            //installExtraFiles();
        }
    }

    //Checks if any core files are missing.
    public void checkFiles(boolean doUpdate){
        ZipInputStream core_zis = new ZipInputStream(getResource(JS_PLUGINS_COREZIP));
        ZipEntry core_entry;
        boolean update = false;
        ArrayList<String> ftu = new ArrayList<String>();
        try{
            if (doUpdate){
                getLogger().warning("[CORE] Updating.");
            }
            while ((core_entry=core_zis.getNextEntry()) != null){
                String filename = core_entry.getName();
                File newFile = new File(plugindir, filename);
                if (!doUpdate){
                    if (newFile.exists() && newFile.isFile() && core_entry.getTime() > newFile.lastModified()){
                        ftu.add(newFile.getCanonicalPath().replace(new File("plugins/jsc").getCanonicalPath()+File.separator, ""));
                        update = true;
                    }
                }
                if (!newFile.exists() && core_entry.isDirectory()){
                    getLogger().info("[CORE] Making directory "+newFile.getCanonicalPath());
                    newFile.mkdirs();
                }
                else{
                    boolean unzip = false;
                    if (!newFile.exists() || doUpdate){
                        unzip = true;
                    }
                    if (unzip && !core_entry.isDirectory()){
                        getLogger().info("[CORE] Unzipping " + newFile.getCanonicalPath());
                        FileOutputStream fout = new FileOutputStream(newFile);
                        for (int c=core_zis.read();c!=-1;c=core_zis.read()){
                            fout.write(c);
                        }
                        fout.close();
                    }
                }
                core_zis.closeEntry();
            }
            core_zis.close();
        }
        catch (IOException ioe){
            getLogger().warning(ioe.getMessage());
            ioe.printStackTrace();
        }
        if (update){
            getLogger().warning("[CORE] Updated files are available! To update, do /jsp update core");
            getLogger().warning("[CORE] Files to update are:");
            for (int i=0;i<ftu.size();i++){
                getLogger().warning("       "+ftu.get(i));
            }
        }
    }

    //Installs the extra plugin files.
    public void installExtraFiles(){
        ZipInputStream extra_zis = new ZipInputStream(getResource(JS_PLUGINS_EXTRAZIP));
        ZipEntry extra_entry;
        try{
            while ((extra_entry=extra_zis.getNextEntry()) != null){
                String filename = extra_entry.getName();
                File newFile = new File(plugindir, filename);
                if (!newFile.exists()){
                    if (extra_entry.isDirectory()){
                        getLogger().info("[EXTRA] Making directory "+newFile.getCanonicalPath());
                        newFile.mkdirs();
                    }
                    else{
                        getLogger().info("[EXTRA] Unzipping " + newFile.getCanonicalPath());
                        FileOutputStream fout = new FileOutputStream(newFile);
                        for (int c=extra_zis.read();c!=-1;c=extra_zis.read()){
                            fout.write(c);
                        }
                        fout.close();
                        extra_zis.closeEntry();
                    }
                }
            }
            extra_zis.close();
        }
        catch (IOException ioe){
            getLogger().warning(ioe.getMessage());
            ioe.printStackTrace();
        }
    }

    public void registerGlobalCommand(String command, String usage, String description){
        //Register the command.
        AbstractCommand abscmd = new JSCGlobalCommand(command, usage, description);
        abscmd.register();
    }

    public class JSCGlobalCommand extends AbstractCommand{
        //Register the command.
        public JSCGlobalCommand(String command, String usage, String description){
            super(command, usage, description);
        }

        //Register tabComplete.
        @Override
        public List<String> onTabComplete(CommandSender sender, Command cmd, String label, String[] args){
            //Pass the params to our plugin's tabComplete handler.
            return pluginInstance.onTabComplete(sender, cmd, label, args);
        }

        //Override command execution.
        @Override
        public boolean onCommand(CommandSender sender, Command cmd, String label, String[] args){
            //Pass the params to our plugin's command handler.
            return pluginInstance.onCommand(sender, cmd, label, args);
        };
    }
}
