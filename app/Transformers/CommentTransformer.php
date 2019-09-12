<?php
namespace App\Transformers;
use App\Comment;
use League\Fractal\TransformerAbstract;
class CommentTransformer extends TransformerAbstract
{

    /**
     * List of resources possible to include
     *
     * @var array
     */   protected $availableIncludes = [
        'commentator','post'
    ];

     /**
     * A Fractal transformer.
     *
     * @return array
     */
    public function transform(Comment $api)
    {
        return [
            'id'      => (int) $api->id,
            'user_id'   =>(int)  $api->user_id,
            'content'    => $api->title,
            'status'    => $api->status,
            'created_at'    => $api->created_at,
            'updated_at'    => $api->updated_at,
        ];
    }

    /**
     * Include Post Author
     *
     * @return \League\Fractal\Resource\Item
     */
    public function includeCommentator(Comment $c)
    {
        $author = $c->commentator;

        return $this->item($author, new UserTransformer);
    }

    /**
     * Include Post Author
     *
     * @return \League\Fractal\Resource\Item
     */
    public function includePost(Comment $c)
    {
        $post = $c->post;

        return $this->item($post, new UserTransformer);
    }

}
