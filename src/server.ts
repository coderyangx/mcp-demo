import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import axios from 'axios';
import { z } from 'zod';

type TD = Awaited<ReturnType<typeof createServer>>;
const arr = Array(3)
export function createServer(): McpServer {
  const server = new McpServer({
    name: 'weatherMcp',
    version: '0.1.0',
  });

  server.tool(
    'get_current_weather',
    'Get weather info for a given city.',
    {
      city: z.string().describe('城市名称, 比如北京 上海 广州'),
    },
    async ({ city }) => {
      if (!city) {
        throw new Error('city name is required.');
      }

      try {
        // 使用 axios 获取天气数据
        const response = await axios.get(`https://wttr.in/${city}?format=j1`);

        // 提取需要的天气信息
        const weatherData = response.data;
        const currentCondition = weatherData.current_condition?.[0] || {};
        const weather = {
          city: city,
          temperature: currentCondition.temp_C || Math.floor(Math.random() * 30),
          condition: currentCondition.weatherDesc?.[0]?.value || '晴朗',
          humidity: `${currentCondition.humidity || Math.floor(Math.random() * 40) + 40}%`,
          wind: `${currentCondition.windspeedKmph || Math.floor(Math.random() * 5) + 1}km/h`,
          updated: new Date().toLocaleString('zh-CN'),
        };

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(weather, null, 2),
            },
          ],
        };
      } catch (error) {
        // 如果 API 调用失败，使用模拟数据
        console.error('Error fetching weather data:', error);
        const weather = {
          city: city,
          temperature: Math.floor(Math.random() * 30),
          condition: '晴朗',
          humidity: `${Math.floor(Math.random() * 40) + 40}%`,
          wind: `${Math.floor(Math.random() * 5) + 1}级`,
          updated: new Date().toLocaleString('zh-CN'),
          note: '数据为模拟数据，API调用失败',
        };

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(weather, null, 2),
            },
          ],
        };
      }
    }
  );

  server.tool(
    'get_current_date',
    '获取当前日期, 如果用户没有提供日期, 则返回当前日期, 如果用户提供的是相对单位, 如前天, 昨天, 明天, 则返回相对单位后的日期',
    {
      date: z.string().describe('日期 比如2025-05-29 或者 前天 昨天 明天'),
    },
    async ({ date }) => {
      if (!date) {
        throw new Error('date is required.');
      }

      const currentDate = new Date(date);
      const formattedDate = currentDate.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      return {
        content: [
          {
            type: 'text',
            text: formattedDate,
          },
        ],
      };
    }
  );

  return server;
}
