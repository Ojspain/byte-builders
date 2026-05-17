import fs from "fs";

// config variables
const NUMBER_OF_USERS = 20;
const NUMBER_OF_POSTS = 50;
const NUMBER_OF_COMMENTS = 80;
const NUMBER_OF_FOLLOWS = 30;
const OUTPUT_FILE_NAME = "dummy_db.json";
const SPECIES_INPUT_FILE = "species.json";

// source arrays
const bugTypes = [
  "Fly",
  "Mosquito",
  "Ladybug",
  "Ant",
  "Mantis",
  "Beetle",
  "Spider",
  "Honeybee",
  "Cicada",
];

const userSuffixes = [
  "Fan",
  "Hater",
  "Watcher",
  "Hunter",
  "Catcher",
  "Spotter",
  "Lover",
  "Enthusiast",
  "Eater",
];

const emailDomains = ["example.com"];

const profilePicUrls = [
  "https://csciprojects.us/342/Lessons/L6/user%20%281%29.jpg",
  "https://csciprojects.us/342/Lessons/L6/user%20%282%29.jpg",
  "https://csciprojects.us/342/Lessons/L6/user%20%283%29.jpg",
  "https://csciprojects.us/342/Lessons/L6/user%20%284%29.jpg",
  "https://csciprojects.us/342/Lessons/L6/user%20%285%29.jpg",
];

const tagOptions = [
  "Scared me!",
  "Crawler",
  "Stationary",
  "Fast",
  "Flying",
  "Ugly",
  "Tiny",
  "Small",
  "Large",
  "Massive beast",
  "Landed on me",
  "Loud",
  "Quiet",
  "Pesky",
  "Got in my face",
];

const locations = [
  "Kitchen",
  "Bedroom",
  "Garden",
  "Bathroom",
  "Garage",
  "Office",
  "Other",
];

const loremWords = [
  "lorem",
  "ipsum",
  "dolor",
  "sit",
  "amet",
  "consectetur",
  "adipiscing",
  "elit",
  "sed",
  "do",
  "eiusmod",
  "tempor",
  "incididunt",
  "ut",
  "labore",
  "et",
  "dolore",
  "magna",
  "aliqua",
  "enim",
  "ad",
  "minim",
  "veniam",
];

// Data loading helper
function loadSpeciesData(filePath) {
  try {
    const rawData = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(rawData);
  } catch (error) {
    console.error(
      `Failed to load species data from ${filePath}. Error: ${error.message}`,
    );
    process.exit(1);
  }
}

// Load the dynamic species data instead of hardcoding
const speciesData = loadSpeciesData(SPECIES_INPUT_FILE);

// helpers for randomly getting items from source
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateLoremIpsum(minWords, maxWords) {
  const targetWordCount = getRandomInt(minWords, maxWords);
  const textArray = [];

  for (let wordIndex = 0; wordIndex < targetWordCount; wordIndex++) {
    textArray.push(getRandomItem(loremWords));
  }

  const rawString = textArray.join(" ");
  return rawString.charAt(0).toUpperCase() + rawString.slice(1) + ".";
}

// generates date with an offset
function generateRandomDate(maxDaysAgo) {
  const currentDate = new Date();
  // 24 hours * 60 mins * 60 secs * 1000 ms
  const randomTimeOffset = getRandomInt(0, maxDaysAgo * 24 * 60 * 60 * 1000);
  const randomPastDate = new Date(currentDate.getTime() - randomTimeOffset);
  return randomPastDate.toISOString();
}

// mongoDB document generators
function createUsers(userCount) {
  const generatedUsers = [];
  for (let userIndex = 1; userIndex <= userCount; userIndex++) {
    const selectedBug = getRandomItem(bugTypes);
    const selectedSuffix = getRandomItem(userSuffixes);
    const randomNumber = getRandomInt(10, 999);

    const generatedUsername = `${selectedBug}${selectedSuffix}${randomNumber}`;

    generatedUsers.push({
      _id: String(userIndex),
      username: generatedUsername,
      email: `${generatedUsername.toLowerCase()}@${getRandomItem(emailDomains)}`,
      passwordHash: `hashed_pass_${getRandomInt(1000, 9999)}`,
      bio: generateLoremIpsum(3, 10),
      profilePicUrl: getRandomItem(profilePicUrls),
      followerCount: 0,
      followingCount: 0,
      createdAt: generateRandomDate(365), //anytime within 1 year
    });
  }
  return generatedUsers;
}

function createPosts(postCount, usersList) {
  const generatedPosts = [];
  for (let postIndex = 1; postIndex <= postCount; postIndex++) {
    const randomUser = getRandomItem(usersList);
    const tagCount = getRandomInt(1, 4);
    const selectedTags = [];

    for (let tagIndex = 0; tagIndex < tagCount; tagIndex++) {
      const potentialTag = getRandomItem(tagOptions);
      if (!selectedTags.includes(potentialTag)) {
        selectedTags.push(potentialTag);
      }
    }

    // Pull the entire object from the imported list
    const selectedSpecies = getRandomItem(speciesData);

    generatedPosts.push({
      _id: String(postIndex),
      authorId: randomUser._id,
      authorName: randomUser.username,
      imageUrl: selectedSpecies.imageUrl || "",
      speciesCommon: selectedSpecies.speciesCommon || "",
      speciesActual: selectedSpecies.speciesActual || "",
      textContent: generateLoremIpsum(5, 25),
      location: getRandomItem(locations),
      tags: selectedTags,
      rating: getRandomInt(1, 5),
      heart: Math.random() > 0.5,
      likeCount: getRandomInt(0, 500), //0 to 500
      sprayCount: getRandomInt(0, 100), //0 to 100
      createdAt: generateRandomDate(365), //anytime within 1 year
    });
  }
  return generatedPosts;
}

function createComments(commentCount, usersList, postsList) {
  const generatedComments = [];
  for (let commentIndex = 1; commentIndex <= commentCount; commentIndex++) {
    const randomUser = getRandomItem(usersList);
    const randomPost = getRandomItem(postsList);

    generatedComments.push({
      _id: String(commentIndex),
      postId: randomPost._id,
      authorId: randomUser._id,
      commentText: generateLoremIpsum(2, 15),
      createdAt: generateRandomDate(180), // Within the last 6 months
    });
  }
  return generatedComments;
}

function createFollows(followCount, usersList) {
  const generatedFollows = [];
  let followIndex = 1;

  let attempts = 0;
  const maxAttempts = followCount * 5;

  // attempt to generate the requested number of unique follow pairs
  while (generatedFollows.length < followCount && attempts < maxAttempts) {
    attempts++;
    const follower = getRandomItem(usersList);
    const followee = getRandomItem(usersList);

    const isSelfFollow = follower._id === followee._id;
    const alreadyExists = generatedFollows.some(
      (followRecord) =>
        followRecord.followerId === follower._id &&
        followRecord.followeeId === followee._id,
    );

    const isValidNewFollow = !isSelfFollow && !alreadyExists;

    if (isValidNewFollow) {
      generatedFollows.push({
        _id: String(followIndex),
        followerId: follower._id,
        followeeId: followee._id,
        createdAt: generateRandomDate(365),
      });

      follower.followingCount += 1;
      followee.followerCount += 1;

      followIndex++;
    }
  }
  return generatedFollows;
}

// main function
function generateDatabase() {
  const usersArray = createUsers(NUMBER_OF_USERS);
  const postsArray = createPosts(NUMBER_OF_POSTS, usersArray);
  const commentsArray = createComments(
    NUMBER_OF_COMMENTS,
    usersArray,
    postsArray,
  );
  const followsArray = createFollows(NUMBER_OF_FOLLOWS, usersArray);

  const completeDatabase = {
    users: usersArray,
    species: speciesData,
    posts: postsArray,
    comments: commentsArray,
    follows: followsArray,
  };

  fs.writeFileSync(OUTPUT_FILE_NAME, JSON.stringify(completeDatabase, null, 2));
  console.log(`Database generated successfully with:
  - ${usersArray.length} Users
  - ${speciesData.length} Species imported from ${SPECIES_INPUT_FILE}
  - ${postsArray.length} Posts
  - ${commentsArray.length} Comments
  - ${followsArray.length} Follows`);
}

generateDatabase();
