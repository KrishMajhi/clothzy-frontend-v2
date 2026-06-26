import './StyleJournal.css';

const SUB_EDITS = [
  {
    category: "Men's Edit",
    name: 'Casual Refinement',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=700&auto=format&fit=crop',
    delay: 'clzv3-d1',
  },
  {
    category: "Kids' Edit",
    name: 'Play in Style',
    image: 'https://images.unsplash.com/photo-1467043237213-65f2da53396f?w=700&auto=format&fit=crop',
    delay: 'clzv3-d2',
  },
];

function StyleJournal() {
  return (
    <section className="clzv3-journal">
      <div className="clzv3-rv">
        <p className="clzv3-eyebrow">The Edit</p>
        <h2 className="clzv3-sec-h">Style <em>Journal</em></h2>
      </div>

      <div className="clzv3-journal-grid">
        <div className="clzv3-journal-main clzv3-rv">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop"
            alt="Women's Edit"
          />
          <div className="clzv3-journal-tag">
            <div className="clzv3-journal-tag-cat">Women's Edit</div>
            <div className="clzv3-journal-tag-name">Summer in the City</div>
          </div>
        </div>

        <div className="clzv3-journal-col">
          {SUB_EDITS.map((edit) => (
            <div className={`clzv3-journal-sub clzv3-rv ${edit.delay}`} key={edit.name}>
              <img src={edit.image} alt={edit.category} />
              <div className="clzv3-journal-tag">
                <div className="clzv3-journal-tag-cat">{edit.category}</div>
                <div className="clzv3-journal-tag-name">{edit.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StyleJournal;
