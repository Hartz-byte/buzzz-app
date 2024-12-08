import { gql } from "@apollo/client";

// GraphQL mutation for sign-up
export const SIGNUP_MUTATION = gql`
  mutation Signup(
    $name: String!
    $email: String!
    $password: String!
    $username: String!
    $profilePicture: String
    $bio: String
  ) {
    signup(
      name: $name
      email: $email
      password: $password
      username: $username
      profilePicture: $profilePicture
      bio: $bio
    ) {
      token
      message
    }
  }
`;

// GraphQL Mutation for login
export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

// Queries for getting users
export const GET_ALL_USERS = gql`
  query {
    getAllUsers {
      id
      name
      username
      profilePicture
    }
  }
`;

// Query to get the current logged-in user
export const GET_CURRENT_USER = gql`
  query {
    currentUser {
      id
    }
  }
`;

// Query to get all usernames
export const GET_ALL_USERNAMES = gql`
  query GetAllUsernames {
    getAllUsernames
  }
`;

// Query to get the users that the logged-in user is following
export const GET_FOLLOWING = gql`
  query ($userId: String!) {
    following(userId: $userId) {
      id
    }
  }
`;

// Mutation to follow a user
export const FOLLOW_USER = gql`
  mutation followUser($targetUserId: String!) {
    followUser(targetUserId: $targetUserId) {
      message
      followingCount
    }
  }
`;

// Mutation to unfollow a user
export const UNFOLLOW_USER = gql`
  mutation unfollowUser($targetUserId: String!) {
    unfollowUser(targetUserId: $targetUserId) {
      message
      followingCount
    }
  }
`;

export const GET_CURRENT_USER_DETAIL = gql`
  query GetCurrentUser {
    currentUser {
      name
      profilePicture
      username
      bio
      followers {
        id
        name
      }
      following {
        id
        name
      }
    }
  }
`;

// GraphQL querie to get all posts
export const GET_USER_POSTS = gql`
  query GetUserPosts($userId: String!) {
    posts(userId: $userId) {
      id
      text
      imageUrl
      createdAt
      user {
        name
        profilePicture
        username
      }
    }
  }
`;

// GraphQL querie to create posts
export const CREATE_POST = gql`
  mutation CreatePost($text: String, $imageUrl: String, $tags: [String]) {
    createPost(text: $text, imageUrl: $imageUrl, tags: $tags) {
      text
      imageUrl
      createdAt
      tags {
        id
        name
      }
    }
  }
`;

// GraphQL mutation to delete a post
export const DELETE_POST_MUTATION = gql`
  mutation DeletePost($postId: String!) {
    deletePost(postId: $postId)
  }
`;

// GraphQL querie to search for users
export const SEARCH_USERS = gql`
  query SearchUsers($searchTerm: String!) {
    searchUsers(searchTerm: $searchTerm) {
      id
      name
      email
    }
  }
`;
