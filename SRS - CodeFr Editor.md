**Software Requirements Specification (SRS)**

# **CodeFr Online IDE**

---

## **Introduction**

This document outlines the requirements for an online Integrated Development Environment (IDE) for the CodeFr programming language. The IDE will be a web application accessible through a web browser, allowing users to write, run, and manage CodeFr code snippets.

### **System Purpose**

The primary purpose of the CodeFr Online IDE is to provide a platform for developers to:

- **Write and Edit**: CodeFr code snippets.
- **Run**: Code snippets in a safe environment using Docker containerization.
- **Save and View**: Past code snippets.
- **Delete**: Unwanted code snippets.
- **Participate in Community**:
  - Post coding challenges.
  - Submit solutions.
  - Test solutions and share feedback.
- **Engage Socially**:
  - Like, share, and comment on code snippets.
  - Share snippets on social media platforms.

### **Target Audience**

The IDE targets developers familiar with or interested in learning the CodeFr programming language:

- **Beginner Developers**: The platform should be user-friendly and provide a smooth learning experience.
- **Experienced Developers**: The IDE should offer features to facilitate efficient coding workflows.

### **References**

- **CodeFr interpreter code and language description**: [GitHub Repository](https://github.com/nitoua-21/CodeFr)

---

## **Overall Description**

### **2.1 Product Perspective**

The CodeFr Online IDE is a web application built using:

- **Frontend**: React.
- **Backend**: Node.js (Express).
- **Database**: MongoDB.
- **Execution**: Docker for containerized CodeFr code execution.

### **2.2 Product Functions**

#### **2.2.1 User Management**
- User Registration and Login.
- Secure user authentication (e.g., email verification, password hashing).
- Profile management and updates.

#### **2.2.2 Code Management**
- **Code Editor**: Syntax highlighting and basic auto-completion for CodeFr.
- **Code Execution**: Run snippets securely in Docker containers.
- **Code Saving**: Save snippets with unique identifiers.
- **History Management**: Access saved snippets.
- **Deletion**: Remove unwanted snippets.

#### **2.2.3 Coding Challenges**
- Post and browse challenges with descriptions and constraints.
- Submit and test solutions.
- Like, share, and comment on challenges and solutions.

#### **2.2.4 Social Features**
- Engage with code snippets and solutions (like, share, comment).
- Share content on external platforms (e.g., Twitter, Facebook).

### **2.3 User Characteristics**

The system caters to:

- **New Users**: Providing a user-friendly, intuitive experience.
- **Experienced Developers**: Offering features to enhance coding workflows.

### **2.4 General Constraints**

- Cross-browser and responsive design.
- Secure data handling and execution.
- Efficient Docker containerization for isolated code execution.

### **2.5 Assumptions and Dependencies**

- Users have a basic understanding of web applications.
- A functional environment with Node.js, MongoDB, and Docker is available for deployment.

---

## **Specific Requirements**

### **3.1 User Management**

1. Capture user details during registration (e.g., username, password, profile information).
2. Implement secure password storage and authentication mechanisms.
3. Provide profile management features (e.g., change password, edit bio).

### **3.2 Code Management**

1. A code editor with syntax highlighting and basic completion for CodeFr.
2. Secure code execution using Docker with isolated containers.
3. Save code snippets with descriptive metadata.
4. Provide a history of saved snippets.
5. Allow snippet deletion.

### **3.3 Coding Challenges**

1. Allow challenge creation with detailed problem descriptions.
2. Support browsing challenges by:
   - Difficulty level (e.g., beginner, intermediate, advanced).
   - Tags (e.g., data structures, algorithms).
3. Enable solution submission and testing against defined cases.
4. Provide community feedback mechanisms (e.g., likes, comments).

### **3.4 Social Features**

1. Users can like and share content.
2. Provide a commenting system for snippets and solutions.
3. Enable sharing on external platforms.

---

## **Design Constraints**

### **4.1 UI/UX**

- Modern and visually appealing UI.
- Intuitive navigation for developers of all levels.

### **4.2 Performance**

- Responsive design for various devices.
- Efficient execution of code within Docker containers.

### **4.3 Security**

- Protect user data and secure code execution.
- Mitigate vulnerabilities (e.g., XSS, SQL injection).

### **4.4 Maintainability**

- Modular and structured codebase.
- Include unit tests for critical components.

---

## **External Interfaces**

1. **UI**: Developed with React.js.
2. **Backend**: Developed with Node.js and Express.js.
3. **Database**: MongoDB for storing data.
4. **Execution**: Docker for running CodeFr code.

---

## **Architecture**
```marmaid
graph TD
    User["User"] --> UI["UI (React components)"]
    UI --> FrontendAPI["Frontend API"]
    FrontendAPI --> BackendAPI["Backend API (Express)"]
    BackendAPI --> DB["Database (MongoDB)"]
    BackendAPI --> DockerEngine["Docker Engine"]
    DockerEngine --> Container["CodeFR Container"]
    Container --> DockerEngine
    DockerEngine --> BackendAPI
    BackendAPI --> FrontendAPI
    FrontendAPI --> UI

```

---

## **APIs and Methods**

### **7.1 Web Client API Routes**

#### User Routes
- `GET /api/users`: Retrieve logged-in user information.
- `POST /api/users`: Register a new user.

#### Code Snippet Routes
- `GET /api/code-snippets`: Retrieve user’s saved snippets.
- `POST /api/code-snippets`: Create a new snippet.
- `GET /api/code-snippets/:id`: Retrieve a snippet by ID.
- `PUT /api/code-snippets/:id`: Update a snippet.
- `DELETE /api/code-snippets/:id`: Delete a snippet.

#### Challenge Routes
- `GET /api/challenges`: Retrieve challenges.
- `GET /api/challenges/:id`: Retrieve challenge details.
- `POST /api/challenges/:id/solutions`: Submit a solution.

#### Solution Routes
- `GET /api/solutions/:id`: Retrieve solution details.

### **7.2 Third-Party APIs**

- **Docker API**: For container management.
- **CodeFr Interpreter**: For executing CodeFr code.

---

## **Data Model**

```mairmaid
erDiagram
    User {
        string id
        string username
        string email
    }
    Profile {
        string id
        string bio
        string avatar
        string userId
    }
    CodeSnippet {
        string id
        string code
        string language
        string userId
    }
    Challenge {
        string id
        string title
        string description
        string userId
    }
    Solution {
        string id
        string code
        string challengeId
        string userId
    }

    User ||--o| Profile : "has one"
    User ||--o{ CodeSnippet : "has many"
    User ||--o{ Challenge : "creates many"
    Challenge ||--o{ Solution : "has many"
    Solution }o--|| User : "submitted by"
    Solution }o--|| Challenge : "for"

```
---

## **User Stories**

1. Register and log in to write CodeFr code.
2. Write, save, and edit code snippets.
3. Execute code snippets safely in Docker containers.
4. Participate in coding challenges to improve skills.

---

## **Non-Functional Requirements**

1. **Usability**: Intuitive for varying levels of experience.
2. **Reliability**: High uptime.
3. **Performance**: Timely responses.
4. **Maintainability**: Easy to update and extend.
5. **Portability**: Deployable on multiple platforms.

---

## **Acceptance Criteria**

- Successful user authentication.
- Full CRUD functionality for snippets and challenges.
- Safe code execution.
- Smooth UI/UX.

---

## **Future Considerations**

1. Integration with version control systems.
2. Advanced code editing features (e.g., debugging).
3. Collaborative coding support.
4. Machine learning features (e.g., code suggestions).
