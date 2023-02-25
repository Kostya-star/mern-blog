import PostModel from "../models/post-model.js";

const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5)

    const tags = posts.map(post => post.tags).flat().slice(0, 5)

    res.json(tags)

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error when fetching for tags'
    })
  }
}

export default {
  getLastTags
}