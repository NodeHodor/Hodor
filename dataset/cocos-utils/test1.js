const coco = require('cocos-utils');

coco.OptCfg()
coco.PluginCfg()

coco.core4cc.unzip('', '', () => null );
coco.core4cc.trans2Module('a.js', './tests', '', '');
try{
    coco.core4cc.merge2Module('a.js', 'b.js', '', '');
}catch(err){}
coco.core4cc.getKeyName("a")
coco.core4cc.getDependencies("abc")
coco.core4cc.getDependencies("./tests", "", () =>{})
coco.core4cc.rmdirSyncRecursive("./tests", "", () =>{})
// coco.core4cc.mkdirRecursive("", "", ()=>{})
// coco.core4cc.mkdirRecumkdirSyncRecursiversive("./tests", "", ()=>{})
coco.core4cc.isAbsolute("a.js")
coco.core4cc.copyFiles("a.js", "./tests", () => {})
coco.core4cc.getStr4Cmd("ls ./")

coco.cocos

coco.msgCode

coco.validLength.validLength("", "./tests", "", "")

coco.fileFmt.Handler("", "")
coco.fileFmt.pubFmt("", "")