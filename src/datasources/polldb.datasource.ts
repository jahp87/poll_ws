import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'polldb',
  connector: 'mongodb',
  url: '',
  host: '127.0.0.1',
  port: 27017,
  user: '',
  password: '',
  database: 'polldb',
  useNewUrlParser: true
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class PolldbDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'polldb';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.polldb', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
