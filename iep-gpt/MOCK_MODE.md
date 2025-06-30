# IEP-GPT Mock Mode

IEP-GPT includes a mock mode that allows you to run the application without needing actual API keys for Groq, Tavily, and Mem0. This is useful for development, testing, and demonstration purposes.

## How Mock Mode Works

When mock mode is enabled, the application will:

1. Generate learning plans using pre-defined templates instead of calling the Groq API
2. Provide mock educational resources instead of searching with Tavily
3. Store and retrieve student profiles in memory instead of using Mem0

All functionality will work as expected, but without making any external API calls.

## Enabling Mock Mode

Mock mode is enabled by default in the server's `.env` file:

```
USE_MOCK_DATA=true
```

To use real API connections:

1. Set `USE_MOCK_DATA=false` in the `.env` file
2. Add your actual API keys for Groq, Tavily, and Mem0

## API Keys

Even with mock mode enabled, you can still provide real API keys for specific services. The application will check each service individually and use real APIs where possible and mock data where needed.

### Required API Keys for Real Mode

To use real APIs, you need the following keys in your `.env` file:

```
GROQ_API_KEY=your_actual_groq_api_key
TAVILY_API_KEY=your_actual_tavily_api_key
MEM0_API_KEY=your_actual_mem0_api_key
MEM0_COLLECTION_ID=your_actual_mem0_collection_id
```

## Mock Data

The mock service provides:

- Pre-defined 7-day learning plans based on student information
- Sample educational resources and teaching strategies
- Mock student profiles for testing

All mock data is designed to be realistic and representative of what you would get from the real APIs.

## Limitations of Mock Mode

While mock mode provides a good approximation of the real application, there are some limitations:

1. Learning plans are not truly personalized based on student data
2. Educational resources are not dynamically searched based on needs
3. Data is not persistently stored between server restarts

## Switching Between Mock and Real Mode

You can switch between mock and real mode by changing the `USE_MOCK_DATA` setting in the `.env` file and restarting the server.

## Checking Current Mode

You can check which mode the server is running in by:

1. Looking at the server startup logs
2. Making a GET request to `/health` endpoint, which will include a `mockMode` field

## Using Mock Mode for Development

Mock mode is ideal for:

- Frontend development without needing API keys
- Testing new features without using API quotas
- Demonstrating the application without real data
- Running in environments where external API calls are restricted

## Getting Real API Keys

When you're ready to use the real APIs:

- Groq API: Sign up at [groq.com](https://console.groq.com/keys)
- Tavily API: Sign up at [tavily.com](https://tavily.com/#api)
- Mem0 API: Sign up at [mem0.ai](https://mem0.ai)
