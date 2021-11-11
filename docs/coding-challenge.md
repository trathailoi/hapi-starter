# Coding Challenge

This is a (hopefully) fun exercise that will help you to become familiar with the new architecture and working with relational data.  Most of the information you'll need to be successful is found in the starter kit documentation.  The rest of what you'll need should be found in the [TypeORM documentation](https://orkhan.gitbook.io/typeorm/docs/).

## Expected Deliverables

In the course of completing this challenge, you'll generate the following deliverables:
- Source code.  Fork this project on GitHub and work in your own repository.  When you're done, let me know where I can find your fork and I'll review it for you.
- Swagger definition (in YAML or JSON).  This isn't strictly required to develop working code, but I want to see how each of you approaches designing your API - and I want you to get familiar with Swagger.
- Time log.  You don't have to put a lot of detail in this just log the number of hours you spent during each day and what you worked on that day.
- Testing scripts that shows that your API is working.  This can be a Postman collection, javascript scripts that invoke the API, or (bonus points) set up a testing framework and write tests.

## What Are We Building?

We're going to build a more complex version of the race cars API.  This time, we're going to track a lot more information and provide a lot more functionality through the API.

## Data Model Requirements
For each car, track the following information:
- The make of the car (Ferrari)
- The model of the car (488 GTE-LM)
- The car's race number
- The class the car competes in (GTE-Pro)
- Who the drivers are.  
- Which team runs the car.  It's safe to assume that a car is run by only one team.
- The race results for the car.

For each driver, we want to track the following information:
- First Name
- Last Name
- Nationality (USA, Viet Nam)
- Home Address
- Management Address

> Assume that drivers can drive any number of cars, for any number of teams.

For each team, we want to track the following information:
- Team Name
- Nationality
- Business Address

> Assume that each team can run more than one car (they usually do!).

For each race, we want to track
- The starting position of each car
- Whether or not each car finished the race
- The finishing position of each car (assuming it finished)

> Note that each race may have multiple classes running in it!  At Le Mans for example, there are four classes competing.  We should be able to generate an overall finishing order for all cars regardless of class, as well as finishing orders for each indivudual class.

## API Requirements

Your API should be able to:
- Create, read one, read many, update one, and delete one of each of the above data classes.
- Return related objects.  For example, if I request a team from the API, I would expect the result to include the cars that the team owns.
- Be able to find all the cars of a certain make and model (hint:  You can use query parameters on your GET route to do this)
- Be able to find all the race results for a particular car or driver

## How To Approach Completing the Challenge

A lot of the complexity of the challenge lies in how you analyze the requirements and structure the data to meet those requirements.  You'll want to pay extra attention to the relationships between the four object types in the requirements.  You'll want to figure out how those relationships work.  For example, the requirements specify that it's safe to assume that each car is run by only one team, but each team can run multiple cars.  That means that there is a one-to-many relationship between teams and cars - one team owns many cars.

You should look for opportunities to break up the data objects into multiple smaller objects so that you can reuse data.  For example, drivers and teams both have addresses, so it makes sense to break out addresses into their own data type.

## What if I need help?

Send me an email!  YOu can also ask one of your teammates. Although I want everyone to try this exercise on their own so that you all get to be familiar with the architecture, please do lean on each other for help!