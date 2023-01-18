import config from "config";
import { FlickrSearchRouter } from "./api/routes/v1/FlickrSearchRouter";
import { FlickrSearchService } from "./api/services/FlickrSearchServices";
import { ExpressWrapper } from "./components/ExpressWrapper";
import { getLogger } from "./utils/Logging";

export class App {
  private logger = getLogger();
  private expressWrapper = new ExpressWrapper();
  private readonly flickSearchService = new FlickrSearchService();

  constructor() {
    const flickrSearchRouter = new FlickrSearchRouter(this.flickSearchService);
    this.expressWrapper.addRouters(
      flickrSearchRouter
    );
  }

  async start(): Promise<void> {
    this.logger.info("Starting App");
    await this.expressWrapper.start(config.get("api.port"));
    this.logger.info("Started App");
  }

  async stop(): Promise<void> {
    this.logger.info("Stopping App");
    await this.expressWrapper.stop();
    this.logger.info("Stopped App");
  }
}
