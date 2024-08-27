# Setting Up AWS Credentials & Bedrock

## Prerequisites

1. AWS Account
   - You can just have the root user for now, but we will set up an IAM user below

## AWS Setup

1. Set up access to AWS Bedrock LLM modes
   1a. Login into your AWS account
   1b. Navigate to Amazon Bedrock and click `Get started`
   1c. Look for `Bedrock configurations` and click on `model access` on the bottom left of the sidebar
   1d. Make note of which region you are in on the top right corner

   - NOTE: `us-east-1`, in the setup of this repo, was selected for the availability of Claude-3-Haiku, which is the LLM model configured in this application (server/routes/index.js)
   - NOTE: For reference, the region you set up your secrets will need to be in the same region you requested access to AWS Bedrock
     1e. Request for all model access or specifically for Anthropic Claude 3 Haiku

2. Create an IAM user
   2a. Navigate to the IAM Dashboard Service
   2b. In the sidebar on the left, under `Access management` click on `Users`
   2c. Click `Create user`, name your new user something you will remember (e.g. `morpheus`), and do NOT click the check box for `Provide user access to the AWS Management Console`!

   - Under `Permissions options` select `Attach policies directly` and search for the permission policy `AmazonBedrockFullAccess` and select that policy
   - Click `Next` and then click `Create user`
     2d. Create an Access Key for the IAM user
   - Back on the `Users` page click on the new user you just created and click `Create access key`
   - For simplicity select `Other` -> `Next` -> `Create access key`, and now save your Access key and Secret access key somewhere secure

3. Setup credentials in the repo
   3a. In Vscode's file explorer navigate to `nextui` -> `app`
   3b. Create a new file called `.env.local`
   3c. Setup your .env.local file to mirror this example:

   ```
   .env.local file

   ACCESS_KEY_ID = <your access_key_id>
   SECRET_ACCESS_KEY = <your secret_access_key>
   ```

# Setting Up Dev Environment

- Please note that you can pull at most 200 images in 6 hours from docker hub, so don't delete images and the cache when you don't need to.

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

## Troubleshooting

If you encounter issues:
