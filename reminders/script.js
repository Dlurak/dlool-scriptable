const school = 'Hogwarts';
const className = '1a';

const url = `https://dlool-backend.onrender.com/homework?page=1&pageSize=10&school=${school}&class=${className}`;
const req = await new Request(url).loadJSON();
if (req.status !== 'success') return;

const data = req.data.homework;


const cal = await Calendar.findOrCreateForReminders('Dlool - Homework')

const createDate = (date) => new Date(date.year, date.month - 1, date.day)

const createReminder = (assign, id, index, reminder = new Reminder()) => {
  reminder.title = assign.subject;
  reminder.notes = `${assign.description}\n\nDo not edit the id!\n${id}+${index}`;
  reminder.calendar = cal;
  reminder.dueDate = createDate(assign.due)
  reminder.dueDateIncludesTime = false;
  
  return reminder;
}


const allReminder = await Reminder.all([cal]);

const getRemindersById = (reminders, id, index) => {
  return reminders.filter((rem) => {
    const match = rem.notes.endsWith(`${id}+${index}`)
    return match;
  })
};


data.forEach((hw) => {
  let index = 0;
  
  hw.assignments.forEach((assign) => {
    const r = getRemindersById(allReminder, hw._id, index);
    const reminderExists = r.length >= 1;
    
    const reminder = reminderExists
        ? createReminder(assign, hw._id, index, r[0])
        : createReminder(assign, hw._id, index);
        
    reminder.save()
    index++;
  });
});