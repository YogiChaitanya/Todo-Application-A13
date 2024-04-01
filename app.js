const express = require('express')
const path = require('path')

// date related modules
const isValid = require('date-fns/isValid')
const format = require('date-fns/format')

// database
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

// access the database purpose
const app = express()
app.use(express.json())
const dbPath = path.join(__dirname, 'todoApplication.db')
let db = null

const initiallizeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log(
        'Server Running at https://yogichaitanyapncjfnjscadoqbs.drops.nxtwave.tech:3000/',
      )
    })
  } catch (e) {
    console.log(`DB ERROR: ${e.message}`)
    process.exit(1)
  }
}
initiallizeDBAndServer()

//import values
const priorityArray = ['HIGH', 'MEDIUM', 'LOW']
const statusArray = ['TO DO', 'IN PROGRESS', 'DONE']
const categoryArray = ['WORK', 'HOME', 'LEARNING']

// app api invalid scenarios1 are failed
const invalidScenarios1 = (request, response, next) => {
  const requestQuery = request.query
  const {status,priority,category,dueDate} = requestQuery
  switch (true) {
    case requestQuery.status !== undefined:
      if (statusArray.includes(status) === undefined) {
        response.status(400)
        response.send('Invalid Todo Status')
      } else {
        next()
      }
      break
    case requestQuery.priority !== undefined:
      if (priorityArray.includes(priority) === undefined) {
        response.status(400)
        response.send('Invalid Todo Priority')
      } else {
        next()
      }
      break
    case requestQuery.category !== undefined:
      if (categoryArray.includes(category) === undefined) {
        response.status(400)
        response.send('Invalid Todo Category')
      } else {
        next()
      }
      break
    case requestQuery.dueDate !== undefined:
      if (isValid.includes(dueDate) === undefined) {
        response.status(400)
        response.send('Invalid Due Date')
      } else {
        next()
      }
      break
  }
}

const hasStatusProperty = requestQuery => {
  return requestQuery.status !== undefined
}
const hasPriorityProperty = requestQuery => {
  return requestQuery.priority !== undefined
}
const hasPriorityAndStatusProperty = requestQuery => {
  return (
    requestQuery.priority !== undefined && requestQuery.status !== undefined
  )
}
const hasCategoryAndStatusProperty = requestQuery => {
  return (
    requestQuery.category !== undefined && requestQuery.status !== undefined
  )
}
const hasCategoryProperty = requestQuery => {
  return requestQuery.category !== undefined
}
const hasCategoryAndPriorityPropertry = requestQuery => {
  return (
    requestQuery.category !== undefined && requestQuery.priority !== undefined
  )
}


// API 1
// step1
// all test cases are failed
// step2
// 1, 2, 3 i got the response
// scenario 4 failed
// why?
// 5 i got the response
// 6 i got the response
// 7 i got the response
app.get('/todos/', invalidScenarios1, async (request, response) => {
  let data = null
  let getTodoQuery = ''
  const {status, priority, category, search_q = ''} = request.query
  switch (true) {
    case hasStatusProperty(request.query):
      getTodoQuery = `
          SELECT
            *
          FROM 
            todo
          WHERE
            status='${status}';`
      break
    case hasPriorityProperty(request.query):
      getTodoQuery = `
        SELECT
          *
        FROM 
          todo
        WHERE
          priority='${priority}';`
      break
    case hasPriorityAndStatusProperty(request.query):
      getTodoQuery = `
        SELECT 
          *
        FROM
          todo
        WHERE
          priority='${priority}'
          AND status='${status}';`
      break
    //we have to check
    case hasCategoryAndStatusProperty(request.query):
      getTodoQuery = `
        SELECT
          *
        FROM
          todo
        WHERE
          category='${category}'
          AND status='${status}';`
      break
    case hasCategoryProperty(request.query):
      getTodoQuery = `
        SELECT
          *
        FROM
          todo
        WHERE
          category='${category}';`
      break
    case hasCategoryAndPriorityPropertry(request.query):
      getTodoQuery = `
        SELECT 
          *
        FROM
          todo
        WHERE
          category='${category}'
          AND priority='${priority}';`
      break
    default:
      getTodoQuery = `
        SELECT 
          *
        FROM
          todo
        WHERE
          todo LIKE '%${search_q}%';`
  }

  const convertDBObjectToResponseObject = dbObject => {
    return {
      id: dbObject.id,
      todo: dbObject.todo,
      priority: dbObject.priority,
      status: dbObject.status,
      category: dbObject.category,
      dueDate: dbObject.due_date,
    }
  }

  data = await db.all(getTodoQuery)
  response.send(data.map(eachTodo => convertDBObjectToResponseObject(eachTodo)))
})


// API 2
// all test cases are failed
// mistake2 in output i want dueDtate but output i got due_date
// test case we need to check
app.get('/todos/:todoId/',  async (request, response) => {
  const {todoId} = request.params
  const getSpecifiTodoById = `SELECT * FROM todo WHERE id=${todoId};`
  const todo = await db.get(getSpecifiTodoById)
  
  const convertDBObjectToResponseObject = dbObject =>{
    return {
      id: dbObject.id,
      todo: dbObject.todo,
      priority: dbObject.priority,
      status: dbObject.status,
      category: dbObject.category,
      dueDate: dbObject.due_date
    }
  }

  // mistake 3 if it is an array we wrote like this
  //response.send(todo.map(eachTodo => convertDBObjectToResponseObject(eachTodo)))
  
  // we have single element
  // then how to write?
  const result = convertDBObjectToResponseObject(todo)
  response.send(result)
  // with above code i got output
})



// API 3
// i got the response empty array
// all test cases are failed
// Why?
app.get('/agenda/',invalidScenarios1,  async (request, response) => {
  const getDateLikeFormat = format(new Date(2021, 01, 21), 'yyyy-MM-dd')
  const getDueDateDetails = `SELECT * FROM todo WHERE due_date='${getDateLikeFormat}';`
  const todoByDate = await db.all(getDueDateDetails)
  response.send(todoByDate)
})





// InvalidScenarios2 for all APIs
// invalidScenarios2 is worng all test cases are failed
// what is wrong in invalidScenario2 i am not getting?
const invalidScenarios2 = (request, response, next) => {
  const requestBody = request.body
  const {status, priority, category, dueDate} = requestBody
  switch (true) {
    case requestBody.status !== undefined:
      if (statusArray.includes(status) === undefined) {
        response.status(400)
        response.send('Invalid Todo Status')
      } else {
        next()
      }
      break
    case requestBody.priority !== undefined:
      if (priorityArray.includes(priority) === undefined) {
        response.status(400)
        response.send('Invalid Todo Priority')
      } else {
        next()
      }
      break
    case requestBody.category !== undefined:
      if (categoryArray.includes(category) === undefined) {
        response.status(400)
        response.send('Invalid Todo Category')
      } else {
        next()
      }
      break
    case requestBody.dueDate !== undefined:
      if (isValid.includes(dueDate) === undefined) {
        response.status(400)
        response.send('Invalid Due Date')
      } else {
        next()
      }
      break
  }
}



// API 4
// i got the response "Todo Successfully Added"
// The POST request to the path '/todos/' should
// return the 'Todo Successfully Added' text as a response upon success
// 1 test case was passed 4 failed
app.post('/todos/',invalidScenarios2, async (request, response) => {
  const requestBody = request.body
  const {id, todo, priority, status, category, dueDate} = requestBody
  const addTodoQuery = `INSERT INTO todo(id,todo,priority,status,category,due_date) VALUES(${id},'${todo}','${priority}','${status}','${category}','${dueDate}');`
  await db.run(addTodoQuery)
  response.send('Todo Successfully Added')
})




// API 5
// i got the response Status Updated
// i got the response Priority Updated
// i got the response Todo Updated
// i got the response Category Updated
// i got the response Due Date Updated
// why test cases are failed
// invalid scenarios are failed 4 test cases are failed
// the reason is in invalidScenario2 i kept request.query insted of request.body
// i changed but agin i am getting erros
app.put('/todos/:todoId/',invalidScenarios2, async (request, response) => {
  const {todoId} = request.params
  const requestBody = request.body

  let updateColumn = ''
  switch (true) {
    case requestBody.status !== undefined:
      updateColumn = 'Status'
      break
    case requestBody.priority !== undefined:
      updateColumn = 'Priority'
      break
    case requestBody.todo !== undefined:
      updateColumn = 'Todo'
      break
    case requestBody.category !== undefined:
      updateColumn = 'Category'
      break
    case requestBody.dueDate !== undefined:
      updateColumn = 'Due Date'
      break
  }

  const previousTodoQuery = `SELECT * FROM todo WHERE id=${todoId};`
  const previousTodo = await db.get(previousTodoQuery)

  const {
    status = previousTodo.status,
    priority = previousTodo.priority,
    todo = previousTodo.todo,
    category = previousTodo.category,
    dueDate = previousTodo.due_date,
  } = request.body

  const updateTodoQuery = `
      UPDATE
        todo
      SET 
        status='${status}',
        priority='${priority}',
        todo='${todo}',
        category='${category}',
        due_date='${dueDate}'
      WHERE 
        id=${todoId};`
  await db.run(updateTodoQuery)
  response.send(`${updateColumn} Updated`)
})




// API 6
// i got the response Todo Deleted
// related all test cases are passed
// mistake4 you dont need to write invalid scenario for delete
app.delete('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  const deleteTodo = `DELETE FROM todo WHERE id=${todoId};`
  await db.run(deleteTodo)
  response.send('Todo Deleted')
})

module.exports = app
