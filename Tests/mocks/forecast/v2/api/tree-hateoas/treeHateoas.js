const faker = require('faker');
const DimensionData = require('../dimensions-data/dimensionData');
const Dimension = require('../dimensions/dimensions');
const Measure = require('../measures/measures');

const getTreeNode = (req, res) => {

    return Promise.all([getDimensions(req.params.id), createMeasures(req.params.id)])
        .then((response) => {
            const dimensionIds = response[0].map(dimension => dimension._id);
            const NODE_QUANTITY = dimensionIds.length * 1;
            const measures = response[1];
            let lastNode = false;
            let dimensionOrder = 0;

            const nodeQuantityByDimension = getNodeQuantityByDimension(NODE_QUANTITY, dimensionIds);
            let randomUuids = generateRandomIdsForDimensions(dimensionIds, nodeQuantityByDimension);

            const myRandomUuid = randomUuids.find(function(randomUuid) {
                return randomUuid.uuids.includes(req.params.node);
            });

            if (myRandomUuid) {
                if (myRandomUuid.order === NODE_QUANTITY-1) {
                    lastNode = true;
                }
                dimensionOrder = myRandomUuid.order;
            }

            createTree(NODE_QUANTITY, req.params.id, req.params.node, dimensionOrder, lastNode, measures).then((tree) => {
                let treeHateoasJSON = JSON.stringify(tree);
                treeHateoasJSON = JSON.parse(treeHateoasJSON);
                const nodeId = req.params.node;
                return nodeId ? res.send(treeHateoasJSON[nodeId]) : res.send(treeHateoasJSON.root);
            });
        });
};

const createTree = (nodeQuantity, forecastId, nodeId, dimensionOrder, lastNode, measures) => {

    return Promise.all([getDimensionsDataQuantity(forecastId),getDimensions(forecastId),getDimensionsData(forecastId)])
        .then(
            response => {
                const dimensionIds = response[1].map(dimension => (dimension._id).toString());
                const dimensionsDataQty = response[0];
                const dimensionDatas = response[2];

                if (!dimensionsDataQty) {
                    dimensionIds.forEach((dimensionId) => dimensionDatas.push(dimensionDataFactory({dimensionId, forecastId})));

                    dimensionDatas.forEach((dimensionData) => {
                        for (let i = 0; i < nodeQuantity; i++) {
                            dimensionData.contents.push(dimensionDataContentFactory());
                        }
                    });

                    dimensionDatas.forEach((dimensionData) => createDimensionData(dimensionData));
                }

                const tree = {};
                if (lastNode) {
                    let dimensionDataIds = getDimensionsDataOfDimension(dimensionIds[0], dimensionDatas);
                    tree[nodeId] = {};
                    tree[nodeId] = nodeFactory({nodeId, dimensionDataId: dimensionDataIds[0], measures});
                } else if (nodeId) {
                    tree[nodeId] = {};

                    const nodeQuantityByDimension = getNodeQuantityByDimension(nodeQuantity, dimensionIds);
                    const randomUuids = generateRandomIdsForDimensions(dimensionIds, nodeQuantityByDimension);
                    const refIds = randomUuids.find((randomUuid) => {
                        return randomUuid.dimensionId === dimensionIds[dimensionOrder+1]
                    });

                    const dimensionDataIds = getDimensionsDataOfDimension(dimensionIds[dimensionOrder], dimensionDatas);

                    const nodeRefs = createNodesRefs(nodeQuantityByDimension[dimensionOrder+1], forecastId, refIds.uuids);
                    const refs = nodeRefs.slice((nodeId.slice(-1) * nodeQuantity), (nodeId.slice(-1) * nodeQuantity) + 4);
                    tree[nodeId] = nodeFactory({nodeId, dimensionDataId: dimensionDataIds[0], children: refs, measures});
                } else {
                    tree['root'] = [];
                    const nodeQuantityByDimension = getNodeQuantityByDimension(nodeQuantity, dimensionIds);
                    const randomUuids = generateRandomIdsForDimensions(dimensionIds, nodeQuantityByDimension);

                    const refIds = randomUuids.find((randomUuid) => {
                        return randomUuid.dimensionId === dimensionIds[1]
                    });
                    const dimensionDataIds = getDimensionsDataOfDimension(dimensionIds[1], dimensionDatas);

                    const nodeRefs = createNodesRefs(nodeQuantityByDimension[1], forecastId, refIds.uuids);
                    const divisionFactor = Math.trunc(nodeRefs.length/nodeQuantity);

                    for (let i = 0; i < nodeQuantity; i++) {
                        const refs = nodeRefs.splice(0, divisionFactor);

                        tree['root'].push(nodeFactory({nodeId: faker.random.uuid(), dimensionDataId: dimensionDataIds[0], children: refs, measures}));
                    }
                }

                return tree;
            }
        )
        .catch(err => { throw new Error(err);});
};

const generateRandomIdsForDimensions = (dimensionIds, nodeQuantityByDimension) => {
    let randomUuidsPerDimension = [];

    const genRandomUuid = (quantity, dimensionIndex) => {
        let uuids = [];
        for (let i = 0; i < quantity; i++) {
            uuids.push(dimensionIds[dimensionIndex]+i);
        }

        return uuids;
    }

    nodeQuantityByDimension.forEach((dimensionNodeQuantity, index) => {
        let dimension = {
            dimensionId: dimensionIds[index],
            order: index,
            uuids: genRandomUuid(dimensionNodeQuantity, index)
        };

        randomUuidsPerDimension.push(dimension);
    });

    return randomUuidsPerDimension;
};

const getNodeQuantityByDimension = (nodeQuantity, dimensionIds) => {
    let nodeQuantityByDimension = [];
    for (let i = 1; i <= dimensionIds.length; i++) {
        nodeQuantityByDimension.push(Math.pow(nodeQuantity, i));
    }

    return nodeQuantityByDimension;
};

const getDimensionsDataOfDimension = (dimensionId, dimensionDatas) => {
    let dimensionDataIds = dimensionDatas.find((dimensionData) => dimensionData.dimensionId === dimensionId.toString());
    dimensionDataIds = dimensionDataIds.contents.map((content) => content.dimensionDataId);
    return dimensionDataIds;
}

const createDimensionData = (dimensionDataObj) => {
    let dimensionData = new DimensionData({
        dimensionId: dimensionDataObj.dimensionId,
        alias: dimensionDataObj.alias,
        forecastId: dimensionDataObj.forecastId,
        contents: dimensionDataObj.contents
    });

    dimensionData.save().then((err) => {
        err && console.error(err);
    });
};

const getDimensions = (forecastId) => {
    return new Promise((resolve) => {
        Dimension.find({'forecastId': forecastId}, (myDimensions) => {
            return myDimensions;
        }).then((result) => {
            resolve(result);
        });
    });
};

const getMeasures = (forecastId) => {
    return new Promise((resolve) => {
        Measure.find({'forecastId': forecastId}, (myMeasures) => {
            return myMeasures;
        }).then((result) => {
            resolve(result);
        });
    });
};

const getDimensionsDataQuantity = (forecastId) => {
    let length = getDimensionsData(forecastId)
        .then((dimensionsDataList) => {
            return dimensionsDataList.length;
        }).catch((err) => {
            console.error(err);
        });

    return length;
};

const getDimensionsData = (forecastId) => {
    return new Promise((resolve) => {
        DimensionData.find({'forecastId': forecastId}, (myDimensionsData) => {
            return myDimensionsData;
        }).then((result) => {
            resolve(result);
        });
    });
};

const createNodesRefs = (quantity, forecastId, refs) => {
    let nodesRefs = [];
    let nodeId;

    for (let i = 0; i < quantity; i++) {
        nodeId = refs.shift();

        nodesRefs.push(nodeRefFactory({value: `/forecast/forecasts/${forecastId}/tree-hateoas/${nodeId}`}));
    }

    return nodesRefs;
};

const nodeRefFactory = ({type = 'ref',value} = {}) => {
    return {
        type,value
    };
};

const nodeFactory = ({nodeId, dimensionDataId,measures,children = null} = {}) => {
    return {
        nodeId,dimensionDataId,measures,children
    };
};

const createMeasures = (forecastId) => {
    return getMeasures(forecastId).then((measureIds) => {
        let ids = measureIds.map(measure => measure._id);

        let measures = [];
        for (let i = 0; i <= ids.length; i++) {
            measures.push(measureFactory({id: `${ids.pop()}`}));
        }
        return measures;
    });
};

const measureFactory = ({id,value = '0',formattedValue = '$ 0.00'} = {}) => {
    return {
        id,value,formattedValue
    };
};

const dimensionDataFactory = ({dimensionId,alias = faker.company.companyName(),forecastId,contents = []} = {}) => {
    return {
        dimensionId,alias,forecastId,contents
    };
};

const dimensionDataContentFactory = ({dimensionDataId = faker.random.uuid(),content = faker.name.findName()} = {}) => {
    return {
        dimensionDataId,content
    };
};

module.exports = {getTreeNode};
