# Studying Elm

I'm finding it pretty difficult to learn, so I'm writing a blog post.

### The example

I am going to study on the [zip-codes example](http://elm-lang.org/examples/zip-codes).
I hope this will allow me (and hopefully someone else) to understand the concepts.
At [the bottom of this post](#resources) you can find all the resurces I've used to find the
needed information.

### The code

I am going to post small chunks of code and comment them, I cannot
guarantee though that the explanation is correct (or that I've explained everything), I
can guarantee though that I made all efforts possible to do so.

Feel free to open issues or fork to point out / fix errors.

#### Imports

Three different ways of importing a module:

```elm
import Char
-- is importing Char as itself so you can write Char.isDigit
import Html exposing (..)
{ -
is adding all functions in Html in the current scope so you can
write div [] [ text "oh hai" ]
-}
import Html.Attributes as Attr exposing (..)
import Html.Events exposing (..)
import Http
import Json.Decode as Json exposing ((:=))
{-
is allowing to call Json.Decode as Json, the last bit exposes := from
Json, you need ( and ) because it's a symbol
-}
import String
import Task exposing (..)
```

* `:=` is explained [here](http://package.elm-lang.org/packages/elm-lang/core/latest/Json-Decode#:=).


#### Result

```elm
-- Result abstracts an operation that could succeed or fail. It is defined as
type Result error value
    = Ok value
    | Err error
```

#### View

```elm
{-
The error value will be a single message, while the
succeed value will be a list of strings.
-}
view : String -> Result String (List String) -> Html
view string result =
  let field =
        input
          [ placeholder "Zip Code"
          , value string
          , on "input" targetValue (Signal.message query.address)
          , myStyle
          ]
          []

      messages =
        case result of
          Err msg ->
              [ div [ myStyle ] [ text msg ] ]

          Ok cities ->
              List.map (\city -> div [ myStyle ] [ text city ]) cities
  in
      div [] (field :: messages)
```

#### CSS

```elm
{-
myStyle returns an Attribute which is formed by an array of tuples
representing CSS styles
-}
myStyle : Attribute
myStyle =
  style
    [ ("width", "100%")
    , ("height", "40px")
    , ("padding", "10px 0")
    , ("font-size", "2em")
    , ("text-align", "center")
    ]
```

#### Main

`main` gets run when the program starts, whenver the value of `query.signal` or
`results.signal` changes they are mapped to `view` using `Signal.map2`, which produces the HTML that is
ultimately shown on the page.

```elm
main =
  Signal.map2 view query.signal results.signal
```

 * [Signal.map2](http://package.elm-lang.org/packages/elm-lang/core/latest/Signal#map2)


#### Query Signal

```elm
{-
Whenever the value represented by either query.signal or results.signal changes it is mapped to
view, using Signal.map2
-}
query : Signal.Mailbox String
query =
  Signal.mailbox ""
```

#### Results Signal

```elm
{-
results is a Mailbox that contains a Result, which will be a String in case of error
or a List String in case of success.
-}
results : Signal.Mailbox (Result String (List String))
results =
  Signal.mailbox (Err "A valid US zip code is 5 numbers.")
```

Explanations of what a `Mailbox` is:

 * http://elm-lang.org/blog/announce/0.15#introducing-mailboxes
 * https://github.com/elm-guides/elm-for-js/blob/master/Mailboxes%2C%20Messages%2C%20and%20Addresses.md

#### Port

[Ports](http://elm-lang.org/guide/interop#ports) let you communicate with JavaScript.

```elm
port requests : Signal (Task x ())
{- in this case we are communicating *to* JavaScript. -}
port requests =
  Signal.map lookupZipCode query.signal
  {-
  produces a Signal of the Tasks that interrogate the server, whenever query.signal
  changes lookupZipCode gets called
  -}
    |> Signal.map (\task -> Task.toResult task `andThen` Signal.send results.address)
    {-
    |> is the forward function application, you could use it as follows:

    double a =
      a * 2

    add a b =
      a + b

    six =
      add 2 1
        |> double

    instead of double (add 2 1), you can see how it's useful with lots of function calls.

    Task.toResult ensures that the task will never fail by joining the error and the
    result of the HTTP query (what the docs above call x and a)
    Result will then be sent to results.address (remember that results is the mailbox)
    -}
```

 * [Forward function application](http://package.elm-lang.org/packages/elm-lang/core/latest/Basics#|>)
 * [Task.toResult](http://package.elm-lang.org/packages/elm-lang/core/latest/Task#toResult)
 * [andThen](http://package.elm-lang.org/packages/elm-lang/core/latest/Maybe#andThen)


#### HTTP call

```elm
lookupZipCode : String -> Task String (List String)
{-
lookupZipCode will return                   ^ List of String, town names
                                  ^ Error of type String

So basically it performs the HTTP call returning a result.
-}
lookupZipCode query =
  let toUrl =
        if String.length query == 5 && String.all Char.isDigit query
          then succeed ("http://api.zippopotam.us/us/" ++ query)
          -- succeed is part of Task, succeeds when run
          else fail "Give me a valid US zip code!"
          -- fail is part of Task, fails when run
  in
      toUrl `andThen` (mapError (always "Not found :(") << Http.get places)
```

 * [Task.succeed](http://package.elm-lang.org/packages/elm-lang/core/latest/Task#succeed)
 * [<<](http://elm-lang.org/blog/announce/0.13#new-function-composition-operators)

#### JSON Decoder

[`Json.Decode`](http://package.elm-lang.org/packages/elm-lang/core/latest/Json-Decode) turns JSON values into Elm values.

```elm
places : Json.Decoder (List String)
places =
  let place =
        Json.object2 (\city state -> city ++ ", " ++ state)
        -- extracts the following two fields from the object
          ("place name" := Json.string)
          ("state" := Json.string)
  in
      "places" := Json.list place
      -- := applies the Decoder to "places"
```


### Resources

 * http://elm-lang.org/docs (rly?)
 * https://github.com/izdi/elm-cheat-sheet
 * https://gist.github.com/ohanhi/0d3d83cf3f0d7bbea9db
 * http://elm-lang.org/examples (of course)
 * https://github.com/isRuslan/awesome-elm
 * http://stackoverflow.com/questions/35492857/difficulties-in-understanding-this-elm-function
