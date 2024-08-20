# Setting Up Dev Environment

* Please note that you can pull at most 200 images in 6 hours from docker hub, so don't delete images and the cache when you don't need to.

## Running the Morpheus containers and Next.js Frontend & Backend

```
# To start the Morpheus containers

make browser-dev
```

```
cd nextui
npm install
npm run dev
```

```
# To stop the Morpheus containers

make browser-down
```

## Developer Workflow

The main branch is only for production. Developers will work only in the dev branch.
The following workflow goes through the process of creating a feature branch through
submitting the pull request.

```
# Start in the dev branch
git checkout dev

# Sync latest dev branch changes from GitHub dev (from other developers) into your local
# dev repo
git pull origin dev

# Create your feature branch, this will also switch you into your new feature branch
git checkout -b [your-name/feature-name]

# Work on your new feature files and when you are ready at least stage all of the changes
# you've made before proceeding.
#
# At this point in the workflow, you are ready to push your new feature branch to GitHub.
# Before pushing your feature to GitHub you will need to sync with the GitHub dev branch
# to bring your local dev repo up to date with latest changes.
#
# So now go back to your local dev branch.
git checkout dev

# Sync the latest changes from GitHub dev to bring your local dev up to date.
git pull origin dev

# Now go back to your feature branch
git checkout [your-name/feature-name]

# Now merge any changes that have happened in the dev branch into your feature branch
# This is where merge conflicts may occur
# You will have to resolve any/all merge conflicts, but hopefully there are none
git merge dev

# After merging and resolving any conflicts you can push your feature branch to GitHub
git push origin dev

# At this point your feature branch should be in GitHub and you will need to create a pull request
# specifically for your feature branch so that the branch can be merged into the GitGub dev branch.
#
# The pull request is necessary so that GitHub dev gets your feature changes and other developers
# can pickup your changes.
#
# repeat as needed, happy coding!!
```

## Troubleshooting

#### Network Capacity

By default, Docker can only create 31 networks. If you try to create more, you would encounter the following error:

```
Error response from daemon: could not find an available, non-overlapping IPv4 address pool among the defaults to assign to the network
```

To expand network capacity, add the following to `/etc/docker/daemon.json`

```
{
  "default-address-pools" : [
    {
      "base" : "172.17.0.0/12",
      "size" : 20
    },
    {
      "base" : "192.168.0.0/16",
      "size" : 24
    }
  ]
}
```

For details, please read [The definitive guide to docker's default-address-pools option](https://straz.to/2021-09-08-docker-address-pools/)