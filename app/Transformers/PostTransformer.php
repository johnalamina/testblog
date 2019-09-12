<?php
namespace App\Transformers;
use App\Post;
use Carbon\Carbon;
use League\Fractal\TransformerAbstract;
class PostTransformer extends TransformerAbstract
{

    /**
     * List of resources possible to include
     *
     * @var array
     */   protected $availableIncludes = [
        'postAuthor','tags','comments'
    ];

     /**
     * A Fractal transformer.
     *
     * @return array
     */
    public function transform(Post $api)
    {
        return [
            'id'      => (int) $api->id,
            'user_id'   =>(int)  $api->user_id,
            'title'    => $api->title,
            'status'    => $api->status,
            'body'    => $api->body,
            'published`_on'    => $api->published_on,
            'created_at'    => $api->created_at,
            'updated_at'    => $api->updated_at,
        ];
    }

    /**
     * Include Post Author
     *
     * @return \League\Fractal\Resource\Item
     */
    public function includePostAuthor(Post $post)
    {
        $author = $post->postAuthor;

        return $this->item($author, new UserTransformer);
    }

    /**
     * Include Post Tags
     *
     * @return \League\Fractal\Resource\Collection
     */
    public function includeTags(Post $post)
    {
        $tags = $post->tags;

        return $this->collection($tags, new TagTransformer);
    }

    /**
     * Include Post Comments
     *
     * @return \League\Fractal\Resource\Collection
     */
    public function includeComments(Post $post)
    {
        $comments = $post->comments;

        return $this->collection($comments, new TagTransformer);
    }
}
