import RpcClient from 'tendermint/lib/rpc'
import { getBlockHash } from 'tendermint/lib/hash'
const client = new RpcClient('ws://localhost:26657')

export const state = () => ({
  nodeInfo: {},
  syncInfo: {},
  blocksByHeight: {},
  txsByHash: {}
})

export const getters = {
  nodeInfo: (state) => state.nodeInfo,
  syncInfo: (state) => state.syncInfo,
  blocks: (state) => state.blocksByHeight,
  latestBlock: (state) =>
    Object.keys(state.blocksByHeight).sort((a, b) => b.localeCompare(a))[0],
  txs: (state) => state.txsByHash
}

export const mutations = {
  updateStatus: (state, status) => {
    state.nodeInfo = status.node_info
    state.syncInfo = status.sync_info
  },
  addBlock: (state, block) => {
    state.blocksByHeight = {
      ...state.blocksByHeight,
      [block.header.height]: {
        ...block,
        hash: getBlockHash(block.header)
      }
    }
  },
  addTx: (state, tx) => {
    state.txsByHash = {
      ...state.txsByHash,
      [tx.tx]: tx
    }
  }
}

export const actions = {
  sync: async ({ commit }) => {
    const status = await client.status()
    commit('updateStatus', status)
    await client.subscribe({ query: "tm.event = 'NewBlock'" }, (event) =>
      commit('addBlock', event.block)
    )
    await client.subscribe({ query: "tm.event = 'Tx'" }, (event) =>
      commit('addTx', event.TxResult)
    )
  },
  fetchBlock: async ({ commit }, height) => {
    const [{ block }, { results }] = await Promise.all([
      client.block({ height }),
      client.blockResults({ height })
    ])
    commit('addBlock', {
      ...block,
      results
    })
  },
  fetchTx: async ({ commit }, hash) => {
    const tx = await client.tx({ hash })
    commit('addTx', tx)
  }
}
