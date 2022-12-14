const router = require("express").Router();
const { Sequelize } = require("sequelize");
const {
  models: { List, User, Card, Project },
} = require("../db");
module.exports = router;

const requireToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const user = await User.findByToken(token);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// GET /api/cards/:projectId
router.get("/:projectId", requireToken, async (req, res, next) => {
  try {
    const project = await Project.findOne({
      where: { id: req.params.projectId },
    });
    const cards = await Card.findAll({
      include: [
        { model: List, where: { projectId: project.id } },
        { model: User },
      ],
      order: [["cardindex", "ASC"]],
    });
    res.json(cards);
  } catch (error) {
    next(error);
  }
});

// POST /api/cards
// Add a card
router.post("/", requireToken, async (req, res, next) => {
  try {
    const totalCardsInList = await Card.findAll({
      where: { listId: req.body.listId },
    });

    let theIndex = 0;

    if (totalCardsInList.length > 0) {
      let increaseOne = totalCardsInList.length;
      theIndex = increaseOne;
    }
    const card = await Card.create({
      title: req.body.title,
      listId: req.body.listId,
      cardindex: theIndex,
    });
    res.json(card);
  } catch (error) {
    next(error);
  }
});

// PUT /api/cards/update
// Edit a cards title and/or description
router.put("/update", requireToken, async (req, res, next) => {
  try {
    const card = await Card.update(
      { title: req.body.title, description: req.body.description },
      { where: { id: req.body.id,  }}
    );
    res.json(card);
  } catch (error) {
    next(error);
  }
});

// PUT /api/cards/cardIndex
// Edit a cards Index in a list
router.put("/cardIndex", requireToken, async (req, res, next) => {
  try {
    const theDifference = req.body.startingIndex - req.body.finishingIndex;

    if (theDifference < 0) {
      for (
        let i = req.body.startingIndex + 1;
        i <= req.body.finishingIndex;
        i++
      ) {
        const card = await Card.findOne({
          where: { cardindex: i, listId: req.body.listId },
        });
        await Card.update(
          {
            cardindex: Sequelize.literal("cardIndex - 1"),
          },
          { where: { id: card.id } }
        );
      }
      const movingCard = await Card.update(
        { cardindex: req.body.finishingIndex },
        { where: { id: req.body.cardDragId } }
      );
      const cards = await Card.findAll({
        include: [{ model: List }],
        order: [
          ["listId", "ASC"],
          ["cardindex", "ASC"],
        ],
      });
      res.json(cards);
    }
    if (theDifference > 0) {
      for (
        let i = req.body.startingIndex - 1;
        i >= req.body.finishingIndex;
        i--
      ) {
        const card = await Card.findOne({
          where: { cardindex: i, listId: req.body.listId },
        });
        await Card.update(
          {
            cardindex: Sequelize.literal("cardIndex + 1"),
          },
          { where: { id: card.id } }
        );
      }
      const movingCard = await Card.update(
        { cardindex: req.body.finishingIndex },
        { where: { id: req.body.cardDragId } }
      );
      const cards = await Card.findAll({
        include: [{ model: List }],
        order: [
          ["listId", "ASC"],
          ["cardindex", "ASC"],
        ],
      });
      res.json(cards);
    }
  } catch (error) {
    next(error);
  }
});

// PUT /api/cards/cardindex/lists
// moving cards to different lists
router.put("/cardindex/lists", requireToken, async (req, res, next) => {
  try {
    const movingCard = await Card.findOne({
      where: {
        listId: req.body.startingListId,
        cardindex: req.body.startingIndex,
      },
    });
    const allCardsStarting = await Card.findAll({
      where: { listId: req.body.startingListId },
    });
    for (let i = req.body.startingIndex + 1; i < allCardsStarting.length; i++) {
      const cardsFromStarting = await Card.findOne({
        where: { cardindex: i, listId: req.body.startingListId },
      });
      // console.log('cardsFromStarting', cardsFromStarting)
      // console.log('i', i)
      await Card.update(
        {
          cardindex: Sequelize.literal("cardIndex - 1"),
        },
        { where: { id: cardsFromStarting.id } }
      );
    }

    const allCardsFinishing = await Card.findAll({
      where: { listId: req.body.finishingListId },
    });
    for (let i = req.body.finishingIndex; i < allCardsFinishing.length; i++) {
      const cardsFromFinishing = await Card.findOne({
        where: { cardindex: i, listId: req.body.finishingListId },
      });
      await Card.update(
        {
          cardindex: Sequelize.literal("cardIndex + 1"),
        },
        { where: { id: cardsFromFinishing.id } }
      );
    }

    await Card.update(
      { cardindex: req.body.finishingIndex, listId: req.body.finishingListId },
      { where: { id: movingCard.id } }
    );
    const allOfCardsInOrder = await Card.findAll({
      include: [{ model: List }],
      order: [
        ["listId", "ASC"],
        ["cardindex", "ASC"],
      ],
    });

    res.json(allOfCardsInOrder);
  } catch (error) {
    next(error);
  }
});
