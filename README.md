# redux-suspense

A redux middleware that lets you use your own data fetching and expose the results in a [suspense compatible way](https://reactjs.org/docs/concurrent-mode-suspense.html)

#### Caution:
* Suspense API is an **experimental features that is not yet available in a stable React release.** 

## Basic usage guide

`npm install redux-suspense`

### Step 1 of 4: Suspense reducer

Add the reducer
```js
// src/reducers/index.js
import { combineReducers } from 'redux'
import { suspenseReducer } from 'redux-suspense'

const rootReducer = combineReducers({
  // ...your other reducers here
  // you have to pass suspenseReducer under 'suspense' key,
  suspense: suspenseReducer
})

```

### Step 2 of 4: Suspense middleware

```js
import { createStore, applyMiddleware } from 'redux';
import { suspenseMiddleware } from 'redux-suspense';

import rootReducer from 'src/reducers/index';

const store = createStore(rootReducer, applyMiddleware(suspenseMiddleware));
```

### Step 3 of 4: Create a resource

```js
// src/resources/postsResources.js
import { createResource } from 'redux-suspense';

export const postsResource = createResource(
  'POSTS',
  fetchPosts, // this is your async function that fetches and returns the posts
)
```

If you want to store the posts in your own reducer just pass a selector to `createResource`. For example:

```js
export const postsResource = createResource(
  'POSTS',
  fetchPosts,
  state => state.yourPostsReducer.posts
)

// Then you can export the success action to handle it in your reducer.
export const { success: fetchPostsSuccess } = postsResource
```

`createResource` will create a couple more things:
* `resourceName` This is the same string you passed as first argument.
* `handler` The function you passed as the second argument.
* `success`, `error` and `request`  These are action creators. All of which have a `toString()` method. In the example above `succes.toString()` would evaluate to `'POSTS_SUCCESS'`
* `selector` The selector you passed as the third argument.

### Step 4 of 4: Consume a resource

Dispatch the resource as an action, as soon as you want to start fetching data. And use `useResource` as if it was a selector, inside a `<Suspense>` tag.

```js
import React, { Suspense, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { postsResource } from 'src/resources/postsResources.js'

function App () {
  const dispatch = useDispatch()
  useEffect(() => dispatch(postsResource), [])

  return (
    <Suspense fallback={<h1> Loading...</h1>}>
      <Posts />
    </Suspense>
  )
}
```

```js
import { useResource } from 'redux-suspense'
import { postsResource } from 'src/resources/postsResources.js'

export function Posts() {
  const users = useResource(postsResource)

  return (
    <div>
      {posts}
    </div>
  )
}
```

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/peter7z/suspense-redux/tags). 

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details
