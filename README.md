# Signiant Service Generator
The Signiant Service Generation tool handles setting up everything you need to get your service up and running. We take care of setting up the project structure, initializing the git repository, and creating the jenkins build plan. Answer a few questions, tell us where to put it, and we will create a service that is ready to deploy at the click of a button.

Currently, Lambda Functions and ECS Microservices are supported.

##### How do I use it?
Using the tool is easy, all you need to do is create an empty repository for your project. Once you've created the repository, find and copy the http clone url, then simply open the tool and follow the prompts to create your service.
Upon completion, you will be presented with links to new service's jenkins job and repository.

### Setup
First clone the repository.
Next, install the dependencies by running
```
 npm install
```
and  
```
bower install
```

Once the dependencies are installed you will need to setup your jenkins credentials.  Modify the config/jenkins.auth.json file, replacing the values for user, baseUrl, and token with your own.  

Git must also be set up on your machine and be configured with the proper credentials to push to the repositories you create for your service over http.

See below for instructions on adding generators

Once configured, run the service generator using the following command
```
node server.js
```

### Making Compatible Generators
In order for a yeoman generator to be compatible with the service generation tool, it must provide and alternate set of angular schema form style prompts.
When the service generation tool runs a generator, it provides a webPrompts option, set to true, indicating that the alternate set of prompts should be used.  It also sets the option 'skip-install' to true, and supplies an argument 'appname'.  

#### Angular Schema Style Prompts  
When a generator is running in the service-generator environment, this.prompt will expect an array of angular schema form definitions instead of an array of prompts.  
An asf definition is a javascript object with a schema property and an optional form property.  If the form property is not present, the service generation tool will create a form using the schema definition, adding a submit and cancel button to the bottom.  In most cases no form object is required.  
For more on angular schema form head over to their [project](https://github.com/json-schema-form/angular-schema-form) and check out the [documentation](https://github.com/json-schema-form/angular-schema-form/blob/development/docs/index.md).

Below is an example prompt, asking the user for their name and age, requiring that the age be at least 13
```
var done = this.async();
this.prompt([{
    "schema": {
        "name": {
            "type": "string",
            "title": "Name",
            "required": true
        },
        "age": {
            "type": "integer",
            "title": "Age",
            "minimum": 13,
            "default": 13,
            "required": true
        }
   }
}], function(answers){
    // Handle answers
    done();
});
```

If more than one asf definition is present in the array, they will be presented in multiple steps.

#### Jenkins Jobs
Each generator also must have a matching jenkins job.  Jenkins jobs are generated by copying a template and changing the scm url.  The template job for a service is found based on the following naming convention: template_<generator name>-build-master.  

For example, the template job for generator lambda would be named template_lambda-build-master.  

If your job does not follow this convention, or no job is created, the service generator will fail on the jenkins step.  

### Adding Generators
Create a top level "generators" directory containing the generators you want to use.  If you wish to map an alternate name to your generator (when prompting user to select a service), add an entry to config/generator-names.json, setting the generator name as the key, and the alternate name as the value.  

For example, to use the name 'AWS Lambda Function' for generator-lambda, and the name 'AWS ECS Microservice' for generator-microservice, the generator-names.json config file would look like this:
```  
{
  "lambda": "AWS Lambda Function",
  "microservice": "AWS ECS Microservice"
}
```