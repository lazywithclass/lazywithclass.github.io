# Create a private github repo in an organisation using the CLI

Today I've had some fun trying to understand how to that, as I couldn't find any example around here we go.

If your user has admin rights in an organisation then you can create a private repository, to find out if you're in such position just execute 

    curl -u "$user:$token" https://api.github.com/orgs/$organisation/teams

which should return an array of teams

    [{
      ...
    }, {
      "name": "devs",
      "id": 123456,
      "slug": "devs",
      "description": null,
      "permission": "admin",
      "url": "https://api.github.com/teams/123456",
      "members_url": "https://api.github.com/teams/123456/members{/member}",
      "repositories_url": "https://api.github.com/teams/123456/repos"
    }, {
      ...
    }]

If `permission` is `"admin"` then you're fine and you can use the `id` value for the next call

    curl -u "$user:$token" https://api.github.com/orgs/$organisation/repos -d '{
      "name": "your-repo-name", 
      "private": true, 
      "team_id": 123456
    }'

...and that's it. Pretty straightforward, yes I know, but still it took me over 2 hours to figure it out.

Here are the links to the relevant APIs 

* https://developer.github.com/v3/orgs/teams/#list-teams
* https://developer.github.com/v3/repos/#create
