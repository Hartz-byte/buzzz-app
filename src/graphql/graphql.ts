import { gql } from "@apollo/client";

// GraphQL mutation for sign-up
export const SIGNUP_MUTATION = gql`
  mutation Signup($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
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
      email
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
      text
      imageUrl
      createdAt
      user {
        name
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
