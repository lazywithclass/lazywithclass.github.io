# Reference an existing IAM role from a CloudFormation template in AWS

So I was looking for a way to remove keys from our servers, Amazon itself suggest that you use IAM instead, so I tried that.

## How

Under `Resources` define 

```JSON
"Testing": {
  "Type": "AWS::IAM::InstanceProfile",
  "Properties": {
    "Path": "/",
    "Roles": ["my-role"]
  }
}
```

`Testing` here is just a reference to this roles declaration, it can be named whatever you want, what is important is that you bind it under `Launchconfig.Properties` like so

```JSON
"LaunchConfig": {                                                                    
  "Properties": {
    "IamInstanceProfile": { 
      "Ref": "Testing"
    },           
    ...
  },
  ...
}
```

In this way you will have `my-role` policies active on the provisioned server.

I've found the relevant information buried in [this piece of documentation](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-launchconfig.html) where it talks about "Example LaunchConfig with IAM Instance Profile", have a look at [the referenced template](https://s3.amazonaws.com/cloudformation-templates-us-east-1/auto_scaling_with_instance_profile.template).

## Why

Not having keys around is a great benefit per se, because you start distributing them and it's easy to lose track of all places you put them in.<br />
Attaching (or removing) a new policy to a role instead is really easy to do and it works right away, from the moment you save your changes.
