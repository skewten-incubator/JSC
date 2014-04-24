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
import com.eclipsesource.json.JsonObject;

import net.sq10.JSC.Metrics;
import net.sq10.JSC.AbstractCommand;

public class JSCPlugin extends JavaPlugin implements Listener{
    private static final String JS_PLUGINS_DIR = "plugins/jsc";
    private static final String JS_COREZIP = "js_core.zip";
    private static final String JS_EXTRAZIP = "js_extra.zip";
    private File plugindir = new File(JS_PLUGINS_DIR);
    
    private ScriptEngine engine = new ScriptEngineManager().getEngineByName("JavaScript");
    private Invocable invocable = (Invocable) engine;
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
        int arrlength = 3;
        String[] dirs = new String[arrlength];
        dirs[0] = "lib";
        dirs[1] = "plugins";
        dirs[2] = "modules";
        for (int i=0;i<arrlength;i++){
            File curitem = new File(JS_PLUGINS_DIR+"lib/");
            if (!curitem.exists() || !curitem.isDirectory()){
                if (curitem.exists()){
                    curitem.delete();
                }
                getLogger().warning("Directory "+curitem.getPath()+" does not exist or is a file, creating dir.");
                curitem.mkdirs();
            }
        }
        checkFiles(false, "core");
        checkFiles(false, "extra");
    }

    //Checks if any core files are missing.
    public boolean checkFiles(boolean update, String what){
        getLogger().info("Checking "+what+".");
        ZipInputStream zis;
        if (what == "core"){
            zis = new ZipInputStream(getResource(JS_COREZIP));
        }
        if (what == "extra" && getResource(JS_EXTRAZIP) != null){
            zis = new ZipInputStream(getResource(JS_EXTRAZIP));            
        }
        else{
            getLogger().warning("checkFiles called with 'what'='"+what+"'; unknown resource!");
            return false;
        }
        ZipEntry zip_entry;
        ArrayList<String> files_to_update = new ArrayList<String>();
        boolean can_be_updated = false;

        try{
            if (update){
                getLogger().warning("["+what+"] Updating.");
            }
            while ((zip_entry = zis.getNextEntry()) != null){
                String filename = zip_entry.getName();
                File newFile = new File(plugindir, filename);
                if (!update){
                    if (newFile.exists() && newFile.isFile() && zip_entry.getTime() > newFile.lastModified()){
                        files_to_update.add(newFile.getCanonicalPath().replace(new File("plugins/jsc").getCanonicalPath()+File.separator, ""));
                        can_be_updated = true;
                    }
                }
                if (!newFile.exists() && zip_entry.isDirectory()){
                    getLogger().info("["+what+"] Making directory "+newFile.getCanonicalPath());
                    newFile.mkdirs();
                }
                else{
                    boolean unzip = false;
                    if (!newFile.exists() || update){
                        unzip = true;
                    }
                    if (unzip && !zip_entry.isDirectory()){
                        getLogger().info("["+what+"] Unzipping " + newFile.getCanonicalPath());
                        FileOutputStream fout = new FileOutputStream(newFile);
                        for (int c=zis.read();c!=-1;c=zis.read()){
                            fout.write(c);
                        }
                        fout.close();
                    }
                }
                zis.closeEntry();
            }
            zis.close();
        }
        catch (IOException ioe){
            getLogger().warning(ioe.getMessage());
            ioe.printStackTrace();
        }
        if (can_be_updated){
            getLogger().warning("["+what+"] Updated files are available! To update, do /jsp update core");
            getLogger().warning("["+what+"] Files to update are:");
            for (int i=0;i<files_to_update.size();i++){
                getLogger().warning("\t"+files_to_update.get(i));
            }
        }
        return true;
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
