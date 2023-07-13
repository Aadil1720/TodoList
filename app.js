const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require('mongoose');
const date=require(__dirname+"/date.js");
const _=require('lodash');
const app=express();
const workItems=[];
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/todoListDB');
    const itemSchema=new mongoose.Schema({
      name:String
    })
    const Item=mongoose.model("Item",itemSchema);
    const item1=new Item({
        name:"Welcome to your todolist!"
    })
    const item2=new Item({
        name:"Hit + button to add a new item."
    })
    const item3=new Item({
        name:"<-- Hit this to delete an item"
    });
    const defaultItems=[item1,item2,item3];
    const listSchema={
        name:String,
        items:[itemSchema]
    }
    const List=mongoose.model("List",listSchema);
    app.get("/",async(req,res)=>{
        const foundItems= await Item.find();
       // let day=date.getDate();//This will give the date by exploring the date.js page
        if(foundItems.length==0){
              Item.insertMany(defaultItems).then(result => {
               console.log("Succesfully inserted the elements.")
        })
       res.redirect("/");
        }else{
          res.render("list",{
             listTitle:"Today",
             newListItems:foundItems
         });
        }
     }) 
app.post("/", async (req, res) => {
      const itemName = req.body.newItem;
      const listName = req.body.list;
      const item = new Item({
        name: itemName
      });
      if (listName=="Today") {
        const save = await item.save();
        console.log(save.name + " is successfully added to the today list");
        res.redirect("/");
      } else {
        const foundList = await List.findOne({ name: listName }).exec();
        console.log("Found List:", foundList.name);
        if (foundList) {
          foundList.items.push(item);
          await foundList.save();
          res.redirect("/" + listName);
        }
      } 
});
  
      app.post("/delete", async (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName=req.body.listName;
  if(listName=="Today"){
  const del = await Item.findByIdAndRemove(checkedItemId);
  console.log(del.name + " is successfully removed.");
  res.redirect("/");
  }else{
    let foundList = await List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}});
      if(foundList){
        res.redirect("/"+listName);
      }
  }
});

app.get("/:customListName",async (req,res)=>{
    const customListName=_.capitalize(req.params.customListName);
   const foundList= await List.findOne({ name: customListName }).exec();
   if(!foundList){
    //To create a new list
    const list=new List({
        name:customListName,
        items:defaultItems
      })
     await list.save();
     res.redirect("/"+customListName);
   }else{
    //To show an existing list
   res.render("list",{listTitle:foundList.name,newListItems:foundList.items});
   }
})
}
main();
app.listen("3000",function(){
    console.log("Server is started on port 3000");
})