import { Redis } from '@upstash/redis';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Pinecone as PineconeClient } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';

export type CompanionKey = {
  companionName: string;
  modelName: string;
  userId: string;
};

export class MemoryManager {
  private static instance: MemoryManager;
  private history: Redis;
  private vectorDbClient: PineconeClient;
  private constructor() {
    this.history = Redis.fromEnv();
    this.vectorDbClient = new PineconeClient({
      apiKey: process.env.PINECONE_API_KEY!,
    });
  }

  public async vectorSearch(
    recentChatHistory: string,
    companionFileName: string
  ) {
    const pineconeClient = this.vectorDbClient;
    const pineconeIndex = pineconeClient.index(
      process.env.PINECONE_INDEX! || ''
    );

    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({ apiKey: process.env.OPENAI_API_KEY }),
      {
        pineconeIndex,
      }
    );
    const similarDocs = await vectorStore
      .similaritySearch(recentChatHistory, 3, { __filename: companionFileName })
      .catch((error) => {
        console.log(error);
      });
    return similarDocs;
  }

  public static getInstance(): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
      return MemoryManager.instance;
    }
    return MemoryManager.instance;
  }

  private generateRedisCompanionKey(companionKey: CompanionKey  ):string {
    return `${companionKey.companionName}-${companionKey.modelName}-${companionKey.userId}`;
  }

  public async writeToHistory(text: string,companionKey: CompanionKey) {
    if(!companionKey|| typeof companionKey.userId === 'undefined') {
      console.log('Companion Key not set correctly')
    }

    const key = this.generateRedisCompanionKey(companionKey);
    const result = this.history.zadd(key,{
      score: Date.now(),
      member: text
    });


    return result
  }

  public async readLatestHistory(companionKey: CompanionKey): Promise<string> {
    if(!companionKey|| typeof companionKey.userId === 'undefined') {
      console.log('Companion Key not set correctly')
      return '';
    }
    const key = this.generateRedisCompanionKey(companionKey);
    let result = await this.history.zrange(key,0,Date.now(),{byScore: true});

    result = result.slice(-30).reverse();

    const recentChats =result.reverse().join('\n');
    return recentChats
  }

  public async seedChatHistory(seedContent:string,delemiter:string='\n',companionKey: CompanionKey) {
    const key = this.generateRedisCompanionKey(companionKey);
    if(await this.history.exists(key)) {
      console.log("Already has chat history")
    }

    const content = seedContent.split(delemiter);
    let counter = 0;
    for(const line of content) {
      await this.history.zadd(key,{
        score: counter,
        member: line
      })
      counter+=1;
    }
  }
}
