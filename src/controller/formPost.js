import { request, response } from "express";
import db from "../conn";

class formPost {
    async createdPost(req = request, res = response) {
        try {
            const { title, content, category } = req.body;
            const userId = req.user.id
    
    
            if(!title || !content || !category) {
                return res.status(400).json({ message : 'input cannot be empty'})
            }
    
            const post = await db.post.create({
                data : {
                    title,
                    content,
                    category,
                    userId: parseInt(userId)
                },
                include: {
                    user : {
                        select : {
                            id: true,
                            name: true,
                            profile: true
                        }
                    }
                }
            })
    
            return res.status(200).json({ 
                message: 'Post created successfully',
                post 
            });
        } catch (error) {
            console.error('Error creating post:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    async getPost(req = request, res = response) {
        try {
            const { category, page = 1, limit = 10 } = req.query;
            const pageNum = parseInt(page)
            const limitNum = parseInt(limit)
            const skip = (pageNum - 1) * limitNum
            
            const whereCondition = {};
            if(category) {
                whereCondition.category = category;
            }

            const [post, total] = await Promise.all([
                db.post.findMany({
                    where: whereCondition,
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                profile: true
                            }
                        },
                        _count: {
                            select: {
                              replies: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' },
                    skip,
                    take: limitNum
                }),
                db.post.count({ where: whereCondition})
            ])

            const totalPage = Math.ceil(total / limitNum);

            return res.status(200).json({
                post,
                pagination: {
                    total,
                    page: pageNum,
                    limit: limitNum,
                    totalPage
                }
            })
        } catch (error) {
            console.error(error.message)
            return res.status(500).json({ message: 'Server error' });
        }
    }

    async getPostDetails (req = request, res = response){
        try {
            const { id } = req.params;
            
            const post =  await db.post.findUnique({
                where : { id: parseInt(id)},
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            profile: true
                        }
                    },
                    replies: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    profile: true
                                } 
                            }
                        },
                    orderBy: { createdAt : 'asc'}
                    }
                },
            })

            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            return res.status(200).json(post);
        } catch (error) {
            console.error('Error creating post:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    }
    
    async createdReply(req = request, res = response ) {
        try {
            const { id } = req.params;
            const { content } = req.body;
            const userId = req.user.id
    
            if(!content) {
                return res.status(400).json({ message: 'Content is required' });
            }
    
            const post = await db.post.findUnique({
                where: { id : parseInt(id)},
                include: { user : true}
            })
    
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
              }

              const reply = await db.reply.create({
                data: {
                    content,
                    postId: parseInt(id),
                    userId: parseInt(userId)
                },
              })
              
            const replyWithUser = await db.reply.findUnique({
                where: { id : reply.id},
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            profile: true
                        }
                    }
                }
            })
    
            if(post.userId !== parseInt(userId)) {
                await db.notification.create({
                    data: {
                        userId: post.userId,
                        message: `${req.user.name} replied to your post "${post.title.substring(0,30)}"`
                    }
                })
            }
    
            return res.status(201).json({ 
                message: 'Reply added successfully',
                replyWithUser 
            });
        } catch (error) {
            console.error('Error creating reply:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    }
}

export default new formPost