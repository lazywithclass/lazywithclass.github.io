# Angularjs and unknown provider

Today I think I understood a bit more about 

> Error: [$injector:unpr] Unknown provider: $modalInstanceProvider <- $modalInstance <- MyController

kind of error.

### The situation

I was trying to introduce testing in a project that needed some attention, this is my controller

```typescript
module myModule {

  'use strict';

  /** @ngInject */
  export class MyController {
   
  public $modalInstance: any;

  /** @ngInject */
  constructor($modalInstance: any) {
    this.$modalInstance = $modalInstance;
  }
    
  // ...
```

and this is the test setup I wrote

```typescript
beforeEach(angular.mock.module('myModule'));

beforeEach(inject((($rootScope: any, $controller: any) => {
  var scope = $rootScope.$new();
  myController = $controller('MyController', {
    $scope: scope
  });
})));
```

They point for me here was that I wasn't understanding this 

```
$modalInstanceProvider <- $modalInstance <- MyController
```

which means that the `$injector` is unable to resolve the required dependency, which 
is the one in the centre.

So all that's to be done is add `$modalInstance`

```typescript
beforeEach(inject((($rootScope: any, $controller: any, $modal: any) => {
  var scope = $rootScope.$new();
  UserModalController = $controller('UserModalController', {
    $scope: scope,
    $modalInstance: $modal // <--- THIS
  });
})));
```

I know this looks silly but took me almost a day to figure out.
