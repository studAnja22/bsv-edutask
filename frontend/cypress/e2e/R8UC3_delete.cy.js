// Code by Anja22 
describe('R8UC3: Task/Todo item GUI tests', () => {
    // define variables that we need on multiple occasions
    let uid // user id
    let name // name of the user (firstName + ' ' + lastName)
    let email // email of the user

    beforeEach(function () {
        // create a fabricated user from a fixture
        cy.fixture('user.json')
        .then((user) => {
            cy.request({
            method: 'POST',
            url: 'http://localhost:5000/users/create',
            form: true,
            body: user
            }).then((response) => {
            uid = response.body._id.$oid
            name = user.firstName + ' ' + user.lastName
            email = user.email
            })
        })
        .then(() => {
            // enter the main main page
            cy.visit('http://localhost:3000')

            // detect a div which contains "Email Address", find the input and type (in a declarative way)
            cy.contains('div', 'Email Address')
            .find('input[type=text]')
            .type(email)

            // submit the form on this page
            cy.get('form')
            .submit()

            // assert that the user is now logged in
            cy.get('h1')
            .should('contain.text', 'Your tasks, ' + name)
        })
        
    })

    it('R8UC3: Deleting todo item should remove it from the todo list', () => {
        // Add a task
        cy.get('input[name="title"')
        .type('Deleting todo item should remove it from todo list')
        cy.get('input[name="url"')
        .type('https://www.youtube.com/watch?v=j64oZLF443g')
        cy.get('input[type=submit]').click()

        // Assert we added the task successfully.
        cy.log('Asserting we added the second task')
        cy.get('p')
        .should('contain.text', 'Here you can find your 1 task')

        // Assert first element should be the task
        cy.log('Asserting the first task is in first place')
        cy.get('.container-element')
        .first()
        .should('contain.text', 'Deleting todo item should remove it from todo list')

        // Click on the first video to open popup
        cy.log('User clicks the video')
        cy.get('.container-element')
        .first()
        .click()

        // First check that we have a x symbol to click
        cy.log('Assert we have a remover button')
        cy.get('.remover')
        .should('contain.text', '✖')

        // Click on delete button (option to delete still there after clicking once)
        cy.log('Clicking the remover x symbol once')
        cy.get('.remover')
        .click()

        // First check that we have a x symbol to click
        cy.log('Assert todo item has been removed from todo list')
        cy.get('.remover')
        .should('not.contain.text', '✖')
    })

    it('R8UC3: Deleted todo item disappears after user clicks on the deleted todo items toggle icon', () => {
        // Add a task
        cy.get('input[name="title"')
        .type('UI updates slowly, user can toggle deleted item')
        cy.get('input[name="url"')
        .type('https://www.youtube.com/watch?v=j64oZLF443g')
        cy.get('input[type=submit]').click()

        // Click on the first video to open popup
        cy.log('User can click toggle item after item has been deleted')
        cy.get('.container-element')
        .first()
        .click()

        // User clicks the deleted todo items icon to toggle it, which should make the UI update and the todo item disappear
        cy.log('User clicks the icon to toggle to done (checked)')
        cy.get('.checker')
        .click()

        // Since we only had one todo item, there should be no todo items after we deleted it
        cy.log('Assert we have a remover button')
        cy.get('.todo-list')
        .should('not.have.class', 'todo-item')
    })

    it('R8UC3: User can delete todo item by clicking on it twice', () => {
        // Add a task
        cy.get('input[name="title"')
        .type('User can click delete twice')
        cy.get('input[name="url"')
        .type('https://www.youtube.com/watch?v=j64oZLF443g')
        cy.get('input[type=submit]').click()

        // Click on the video
        cy.log('User clicks the video')
        cy.get('.container-element')
        .first()
        .click()

        // First check that we have a x symbol to click
        cy.log('Assert we have a remover button')
        cy.get('.remover')
        .should('contain.text', '✖')

        // Clicking the button twice or asserting something seem to update the UI, removing the todo item after clicking
        cy.log('Clicking the remover x symbol once')
        cy.get('.remover')
        .click()

        cy.log('Clicking the remover x symbol twice')
        cy.get('.remover')
        .click()

        // Asserting our todo-list is empty after deleting it.
        cy.log('Assert we have a remover button')
        cy.get('.todo-list')
        .should('not.have.class', 'todo-item')
    })

    afterEach(function () {
        // clean up by deleting the user from the database
        cy.request({
        method: 'DELETE',
        url: `http://localhost:5000/users/${uid}`
        }).then((response) => {
        cy.log(response.body)
        })
    })
})