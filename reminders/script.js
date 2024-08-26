////////////////////////
// SETTINGS FOR USERS //
////////////////////////

const school = 'Hogwarts';
const classes = [
	'Programming',
  'Haskell',
];
const reminderName = 'Dlool-homework'
/** There is a warning that the id may not be edited, disable/enable this warning */
const enableWarningDescriptionWarning = true

//////////////////
// SETTINGS END //
//////////////////

const url = `https://dlool.onrender.com/assignments?offset=0&limit=10&school=${school}&classes=${classes.join(',')}`;
const req = await new Request(url).loadJSON();
if (req.status !== 'success') return;
const { assignments }  = req.data;

const cal = await Calendar.findOrCreateForReminders(reminderName);

const allReminder = await Reminder.all([cal]);

const createDate = (date) => new Date(date.year, date.month - 1, date.day);

const createReminder = (assign, id, reminder = new Reminder()) => {
	reminder.title = assign.subject;
	reminder.notes = enableWarningDescriptionWarning
		? `${assign.description}\n\nDo not edit the id!\n${id}`
		: `${assign.description}\n\n${id}`;
	reminder.calendar = cal;
	reminder.dueDate = createDate(assign.due)
	reminder.dueDateIncludesTime = false;

	return reminder;
}

const getRemindersById = (reminders, id) => 
	reminders.filter((rem) => 
		rem.notes?.endsWith(id)
	)


assignments.forEach((assign) => {
	const { id } = assign
	const r = getRemindersById(allReminder, id);
	const reminderExists = r.length >= 1;

	const reminder = reminderExists
		? createReminder(assign, id, r[0])
		: createReminder(assign, id);

	reminder.save()
});
