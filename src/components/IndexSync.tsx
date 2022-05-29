import IComponentProps from '@/base/interfaces/IComponentProps';
import React, { Component } from 'react';

interface IIndexSyncState {}
interface IIndexSyncProps extends IComponentProps {}

/**
 * IndexSync
 */
class IndexSync extends Component<IIndexSyncProps, IIndexSyncState> {
  render() {
    return <div>IndexSync</div>;
  }
}

export default IndexSync;
