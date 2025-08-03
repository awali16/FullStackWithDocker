module.exports = {
  SUCCESS: 200,
  BET_ALREADY_MATCHED: 205,
  BAD_REQUEST: 400,
  PAGE_NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  INTERNAL_SERVER: 500,
  NOT_ACCEPTABLE: 406,
  DATA_CONFLICT: 409,
  CREATED: 201,
  FAIL: 400,
  ACTIVE: "1",
  INACTIVE: "0",
  DELETE: "2",
  PER_PAGE: 10,
  DEFAULT_PAGE: 1,
  MIN_AGE: 18,
  // 📦 Sample tasks
  sampleData: [
    {
      id: 1,
      title: "Buy groceries",
      description: "Milk, Eggs, Bread, and Fruits",
      completed: false,
    },
    {
      id: 2,
      title: "Finish project report",
      description: "Complete the final draft and send to the manager",
      completed: true,
    },
    {
      id: 3,
      title: "Workout",
      description: "30-minute run and 15-minute strength training",
      completed: false,
    },
    {
      id: 4,
      title: "Call plumber",
      description: "Fix kitchen sink leakage",
      completed: false,
    },
    {
      id: 5,
      title: "Book flight tickets",
      description: "Round trip to Dubai next month",
      completed: true,
    },
    {
      id: 6,
      title: "Pay electricity bill",
      description: "Due by the end of the week",
      completed: false,
    },
    {
      id: 7,
      title: "Attend React meetup",
      description: "Online meetup on React 19 features",
      completed: false,
    },
    {
      id: 8,
      title: "Read a book",
      description: "Finish 'Atomic Habits'",
      completed: true,
    },
    {
      id: 9,
      title: "Organize workspace",
      description: "Clean desk and sort cables",
      completed: false,
    },
    {
      id: 10,
      title: "Update resume",
      description: "Add latest React + Tailwind projects",
      completed: false,
    },
  ],
 getFormattedTime: ()=>{
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12; // convert to 12-hour format, 0 => 12
  const minutesStr = minutes < 10 ? "0" + minutes : minutes;
  return `${hours}:${minutesStr}${ampm}`;
}

};
