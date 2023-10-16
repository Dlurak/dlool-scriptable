const school = "Hogwarts";
const className = "1a";

const url = `https://dlool-backend.onrender.com/homework?page=1&pageSize=1&school=${school}&class=${className}`

const req = new Request(url);
let rawData = {};
try {
  rawData = await req.loadJSON();
} catch {
  rawData.status = "error"
}
const isSuccessfull = rawData.status === 'success';

//-// FETCHING DONE //-//

const widget = new ListWidget()
widget.backgroundColor = new Color("#222222");

if (isSuccessfull) {
  const mainStack = widget.addStack()
  const subjStack = mainStack.addStack();
  subjStack.layoutVertically();
  mainStack.addSpacer(4)
  const descStack = mainStack.addStack();
  descStack.layoutVertically()
  
  const homework = rawData.data.homework[0];
  
  homework.assignments.forEach((assignment) => {
    const subjText = subjStack.addText(assignment.subject);
    subjText.textColor = Color.white();
    subjText.font = Font.boldSystemFont(16);
    subjText.lineLimit = 1;
    
    const descText = descStack.addText(assignment.description);
    descText.textColor = Color.white()
    descText.lineLimit = 1
    console.log(assignment)
  });
} else {
  const text = widget.addText("Error");
  text.centerAlignText();
  text.textColor = Color.white()
  text.font = Font.boldSystemFont(36);
}


if (config.runsInWidget) Script.setWidget(widget);
else widget.presentMedium();

Script.complete()