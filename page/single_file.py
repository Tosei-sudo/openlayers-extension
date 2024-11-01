
import os
import glob
import base64

def join_files(dir):
    
    data_map = {}
    
    filelist = glob.glob(dir + '/*')
    
    for filename in filelist:
        if(os.path.isdir(filename)):
            dirName = os.path.basename(filename).replace("-", "_")
            data_map[dirName] = join_files(filename)
        else:
            with open(filename, 'r') as f:
                base_str = "data:text/javascript;base64," + base64.b64encode(f.read()).decode()
                
                fName = os.path.basename(filename).replace(".js", "").replace("-", "_")
                data_map[fName] = base_str
    return data_map

def main():
    data_map = join_files("./page")
    
    import json
    with open("page.json", "w") as f:
        f.write(json.dumps(data_map, indent=4))
# const mod = await import(data);
# mod.hello("world");
if __name__ == '__main__':
    main()