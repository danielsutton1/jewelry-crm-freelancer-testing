# 🧪 **FREELANCER TESTING CHALLENGES**
## Jewelry CRM - Developer Assessment

### **Overview**
This repository contains 5 complex coding challenges designed to test a freelancer's skills before hiring them for our jewelry CRM project. Each challenge represents a real error from our production codebase.

### **Technology Stack**
- **Frontend**: Next.js 14, TypeScript, React
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (Supabase)
- **Styling**: Tailwind CSS

### **Challenge Structure**
Each challenge includes:
- Problem description
- Error message
- Broken code
- Requirements
- Success criteria
- Test cases

### **Evaluation Criteria**
1. **Code Quality** (25%) - Clean, readable, maintainable code
2. **Error Handling** (25%) - Proper error handling and validation
3. **TypeScript Usage** (20%) - Correct types and interfaces
4. **Testing Approach** (15%) - Test cases and validation
5. **Documentation** (15%) - Clear explanations and comments

### **Submission Requirements**
For each challenge, provide:
1. **Working code solution**
2. **Explanation of the fix**
3. **Test cases**
4. **Time taken to complete**
5. **Any questions or clarifications**

### **How to Submit**
1. Fork this repository
2. Create a branch for your solutions
3. Complete each challenge in its respective folder
4. Submit a pull request with your solutions



### **Contact**
For questions about the challenges, please contact us through Upwork.

---

## 🚀 **GETTING STARTED**

1. **Clone this repository**
2. **Read each challenge carefully**
3. **Set up your development environment**
4. **Start with Challenge 1**
5. **Submit your solutions**

Good luck! 🍀

## RUN COMMANDS

## Run Challenge 1

-- Test 1: Valid update
SELECT update_customer_company('New Company Name', '550e8400-e29b-41d4-a716-446655440002');

-- Test 2: Invalid customer ID
SELECT update_customer_company('New Company Name', '550e8400-e29b-41d4-a716-446655440009');

-- Test 3: Empty company name
SELECT update_customer_company('', '550e8400-e29b-41d4-a716-446655440002');

-- Test 4: NULL company name
SELECT update_customer_company(NULL, '550e8400-e29b-41d4-a716-446655440003');

## Run Challenge 2

npx jest

## Run Challenge 3

npx jest challenge-3/test-cases.test.ts

## Run Challenge 4

npx jest challenge-4/test-cases.test.ts


## Run Challenge 5

npx jest challenge-5/test-cases.test.ts